import { ResultType } from "@prisma/client";
import prisma from "~/configs/prisma";
import { CandidateType } from "~/schemas/candidate.schema";
import { paginate } from "~/utils/pagination";

class CandidateRepository {
    getCandidates = async (page: number = 1, limit: number = 20) => {
        const result = await paginate<any>(prisma.candidate, {
            // where: {
            //     scoreResults: {
            //         some: {
            //             result: "PASSED",
            //         },
            //     },
            // },
            page,
            limit,
            orderBy: [
                {
                    id: "desc",
                },
            ],
            include: {
                scoreResults: {
                    omit: {
                        updatedAt: true,
                        createdAt: true,
                        candidateId: true,
                    },
                },
            },
        });
        return result;
    };
    findByStudentCode = (studentCode: string) => {
        return prisma.candidate.findUnique({
            where: {
                studentCode,
            },
        });
    };
    createMany = async (data: CandidateType[]) => {
        const result = await prisma.candidate.createMany({
            data,
            skipDuplicates: true,
        });
        return result;
    };
    deleteMany = async (studentCodes: string[]) => {
        const result = await prisma.candidate.deleteMany({
            where: {
                studentCode: {
                    not: {
                        in: studentCodes,
                    },
                },
            },
        });
        return result;
    };
    updateCreatedAtFirst = async (studentCode: string) => {
        const result = await prisma.candidate.update({
            where: {
                studentCode,
            },
            data: {
                createdAt: new Date(),
            },
        });
        return result;
    };
    confirmSendMail = async (ids: string[]) => {
        const result = await prisma.candidate.updateMany({
            where: {
                id: {
                    in: ids,
                },
                isSendMail: false,
            },
            data: {
                isSendMail: true,
                updatedAt: new Date(),
            },
        });
        return result;
    };

    getAnyEmail = async (qty: number, result: ResultType) => {
        return prisma.candidate.findMany({
            where: {
                isSendMail: false,
                scoreResults: {
                    some: {
                        result: result,
                        round: "ROUND_2",
                    },
                },
            },
            take: qty,
            orderBy: {
                createdAt: "desc",
            },
        });
    };

    updateStatusSendMail = (emails: string[]) => {
        return prisma.candidate.updateMany({
            where: {
                email: {
                    in: emails,
                },
            },
            data: {
                isSendMail: true,
            },
        });
    };

    getCandidateByEmail = async (email: string) => {
        return prisma.candidate.findUnique({
            where: {
                email,
            },
        });
    };
    changeStatus = async (id: string, status: "PASSED" | "FAILED") => {
        return prisma.scoreResult.updateMany({
            where: {
                candidateId: id,
                round: "ROUND_2",
            },
            data: {
                result: status,
                updatedAt: new Date(),
            },
        });
    };
}
const candidateRepository = new CandidateRepository();
export default candidateRepository;
