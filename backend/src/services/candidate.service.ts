import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import Candidate, { CandidateType } from "~/schemas/candidate.schema";
import Helpers from "~/utils/helpers";
import fs from "fs";
import candidateRepository from "~/repositories/candidate.repository";
import prisma from "~/configs/prisma";
import logRepository from "~/repositories/log.repository";
import userRespository from "~/repositories/user.repository";

class CandidateService {
    public getAll = async (page: number = 1, limit: number = 20) => {
        const data = await candidateRepository.getCandidates(page, limit);

        return data;
    };
    public handleRawData = async (userId: string, filePath: string | null) => {
        if (!filePath)
            throw new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: "Vui lòng tải lên file DATA" });
        const candidates = await this.handleFileData(userId, filePath);
        const result = await candidateRepository.createMany(candidates);
        const studentsCode = candidates.map((item) => item.studentCode);
        await candidateRepository.deleteMany(studentsCode);
        await candidateRepository.updateCreatedAtFirst(studentsCode[0]);
        return result;
    };
    public confirmSendMail = async (userId: string, ids: string[]) => {
        const user = await userRespository.findById(userId);
        if (user) {
            await candidateRepository.confirmSendMail(ids);
            await logRepository.writeLogs(user.id, `Đã đăng nhập vào hệ thống!`);
        } else {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Người dùng không tồn tại trong hệ thống!",
            });
        }
    };
    public getCandidateStats = async () => {
        // 1. Định nghĩa phạm vi thời gian cho Ngày hôm nay
        const today = Helpers.getStartOfDay(new Date());
        const tomorrow = Helpers.getNextDay(new Date());

        // 2. Tính toán các chỉ số
        const record = await prisma.candidate.findMany();

        const receivedMailCount = await prisma.candidate.count({
            where: { isSendMail: true },
        });

        const candidatesCreatedToday = await prisma.candidate.count({
            where: {
                createdAt: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });
        const lastUpdatedCandidate = await prisma.candidate.findFirst({
            orderBy: {
                createdAt: "desc", // Sắp xếp giảm dần (mới nhất lên đầu)
            },
            select: {
                createdAt: true,
            },
        });

        let groupMajor = (
            await prisma.candidate.groupBy({
                by: ["major"],
                _count: {
                    major: true,
                },
            })
        ).map((item) => ({
            major: item.major,
            count: item._count.major,
        }));

        // tính theo khóa
        const object: { [key: string]: number } = {};
        record.forEach((item) => {
            const ch = item.studentCode.substring(2, 4);
            if (!object[ch]) object[ch] = 1;
            else object[ch]++;
        });

        return {
            totalCandidates: record.length,
            receivedMailCount,
            notReceivedMailCount: record.length - receivedMailCount,
            candidatesCreatedToday,
            lastUpdatedCandidate: lastUpdatedCandidate?.createdAt,
            groupMajor,
            stats: object,
        };
    };

    public exportData = () => {};

    private handleFileData = async (userId: string, filePath: string) => {
        const candidates: CandidateType[] = [];

        try {
            const fileContent = fs.readFileSync(filePath, "utf8");

            const rawSplit = fileContent.split("\n");
            for (let item of rawSplit) {
                const splitTab = item.split("\t");
                for (let i = 1; i <= 7; ++i) {
                    splitTab[i] = Helpers.filterRawInfo(splitTab[i].trim());
                }
                candidates.push(
                    new Candidate({
                        firstName: splitTab[1],
                        lastName: splitTab[2],
                        major: splitTab[3],
                        email: splitTab[4],
                        phone: splitTab[5],
                        semester: splitTab[6],
                        studentCode: splitTab[7],
                    }),
                );
            }
            await logRepository.writeLogs(userId, `Đã cập nhật dữ liệu mới nhất!`);
            return candidates;
        } catch (error) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: "Không thể đọc được dữ liệu từ file" + error,
            });
        }
    };
}
const candidateService = new CandidateService();
export default candidateService;
