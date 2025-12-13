import fs from "fs";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import { CandidateScore } from "~/schemas/candidate.schema";

import logRepository from "~/repositories/log.repository";
import ScoreResult from "~/schemas/score-result.schema";

import candidateRepository from "~/repositories/candidate.repository";
import prisma from "~/configs/prisma";
import { RoundType } from "~/constants/enums";
import { log } from "console";
import { ca } from "zod/locales";
class ScoreService {
    // data có dạng: nguyenthanhtrieta@gmail.com,40,ROUND_1
    public handleScoreRawData = async (userId: string, filePath: string | null) => {
        if (!filePath)
            throw new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: "Vui lòng tải lên file DATA" });
        const candidates = await this.handleFileScoreData(userId, filePath);
        const mapUUID = new Map<string, string>();
        const mapInfo = new Map<string, { score: number }[]>();
        for (const candidate of candidates) {
            const candi = await candidateRepository.getCandidateByEmail(candidate.email);
            if (candi && candi.email) {
                mapUUID.set(candidate.email, candi.id);
                if (mapInfo.has(candidate.email)) {
                    const arr = mapInfo.get(candidate.email) as { score: number }[];
                    arr.push({ score: candidate.score });
                    mapInfo.set(candidate.email, arr);
                } else {
                    mapInfo.set(candidate.email, [{ score: candidate.score }]);
                }
            }
        }
        for (const candidate of candidates) {
            const candidateUUID = mapUUID.get(candidate.email) as string;
            const candidateScore = mapInfo.get(candidate.email);
            const candidateRound = candidate.round as RoundType;

            if (candidateUUID && candidateScore !== undefined) {
                try {
                    await prisma.scoreResult.upsert({
                        where: {
                            candidateId: candidateUUID,
                        },
                        update: {
                            score: candidateScore,
                            round: candidateRound,
                        },
                        create: {
                            candidateId: candidateUUID,
                            round: candidateRound,
                            score: candidateScore,
                        },
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        }
        return candidates;
    };
    private handleFileScoreData = async (userId: string, filePath: string) => {
        const candidates: CandidateScore[] = [];

        try {
            const fileContent = fs.readFileSync(filePath, "utf8");

            const rawSplit = fileContent.split("\n");
            for (let item of rawSplit) {
                const splitTab = item.split(",");

                for (let i = 0; i <= 2; ++i) {
                    splitTab[i] = splitTab[i]?.trim();
                }

                candidates.push({
                    email: splitTab[0],
                    score: Number(splitTab[1]),
                    round: splitTab[2] as RoundType,
                });
            }
            await logRepository.writeLogs(userId, `Đã cập nhật dữ liệu điểm số của ứng viên mới nhất!`);
            return candidates;
        } catch (error) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: "Không thể đọc được dữ liệu từ file" + error,
            });
        }
    };
}
const scoreService = new ScoreService();
export default scoreService;
