import prisma from "~/configs/prisma";
import { CandidateType } from "~/schemas/candidate.schema";
import { paginate } from "~/utils/pagination";

class CandidateRepository {
    getCandidates = async (page: number = 1, limit: number = 20) => {
        const result = await paginate<any>(prisma.candidate, {
            where: {},
            page,
            limit,
            orderBy: [
                {
                    id: "desc",
                },
            ],
        });
        return result;
    };
    createMany = async (data: CandidateType[]) => {
        const result = await prisma.candidate.createMany({
            data,
            skipDuplicates: true,
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
}
const candidateRepository = new CandidateRepository();
export default candidateRepository;
