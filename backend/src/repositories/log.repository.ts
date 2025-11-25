import prisma from "~/configs/prisma";
import LoginLog from "~/schemas/log.schema";
import { paginate } from "~/utils/pagination";

class LogRepository {
    writeLogs = (id: string, note: string) =>
        prisma.loginLog.create({
            data: new LoginLog({ userId: id, note }),
        });
    getAll = async (page: number = 1, limit: number = 20) => {
        const result = await paginate<any>(prisma.loginLog, {
            where: {},
            page,
            limit,
            include: {
                user: true,
            },
            orderBy: [
                {
                    createdAt: "desc",
                },
            ],
        });
        return result;
    };
}
const logRepository = new LogRepository();
export default logRepository;
