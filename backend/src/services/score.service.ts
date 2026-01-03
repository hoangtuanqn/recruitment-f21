import fs from "fs";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";

import logRepository from "~/repositories/log.repository";

import candidateRepository from "~/repositories/candidate.repository";
import prisma from "~/configs/prisma";
type CandidateScore = {
    email?: string;
    fullName: string;
    studentCode: string;
    score: number;
};
class ScoreService {
    // data cũ có dạng: nguyenthanhtrieta@gmail.com,40,ROUND_1
    // data mới có dạng: Lâm Hoàng An|SE201018|159
    public handleScoreRawData = async (userId: string, filePath: string | null) => {
        if (!filePath)
            throw new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: "Vui lòng tải lên file DATA" });
        const candidates = await this.handleFileScoreData(userId, filePath);
        const mapUUID = new Map<string, string>();
        const mapInfo = new Map<string, { score: number }[]>();
        for (const candidate of candidates) {
            // console.log("candidate.studentCode", candidate.studentCode);
            const candi = await candidateRepository.findByStudentCode(candidate.studentCode);
            if (candi && candi.studentCode) {
                mapUUID.set(candi.studentCode, candi.id);
                if (mapInfo.has(candi.studentCode)) {
                    const arr = mapInfo.get(candi.studentCode) as { score: number }[];
                    arr.push({ score: candidate.score });
                    mapInfo.set(candi.studentCode, arr);
                } else {
                    mapInfo.set(candi.studentCode, [{ score: candidate.score }]);
                }
            }
        }
        for (const candidate of candidates) {
            const candidateUUID = mapUUID.get(candidate.studentCode) as string;
            const candidateScore = mapInfo.get(candidate.studentCode);

            if (candidateUUID && candidateScore !== undefined) {
                try {
                    await prisma.scoreResult.create({
                        data: {
                            firstSubmit: "",
                            finalSubmit: "",
                            candidateId: candidateUUID,
                            round: "ROUND_2",
                            result: "PASSED",
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
                const splitTab = item.split("|");

                for (let i = 0; i <= 2; ++i) {
                    splitTab[i] = splitTab[i]?.trim();
                }
                // console.log("splitTab", splitTab);

                candidates.push({
                    fullName: splitTab[0],
                    studentCode: splitTab[1],
                    score: Number(splitTab[2]),
                });
            }
            // console.log("candidates >> candidates", candidates.length);
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
