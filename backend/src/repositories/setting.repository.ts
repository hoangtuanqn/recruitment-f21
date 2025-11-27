import prisma from "~/configs/prisma";
import { CandidateType } from "~/schemas/candidate.schema";
import { paginate } from "~/utils/pagination";

class SettingRepository {
    get = async (name: string) => {
        return prisma.settings.findUnique({
            where: { name },
            select: { value: true },
        });
    };
}
const settingRepository = new SettingRepository();
export default settingRepository;
