import prisma from "~/configs/prisma";
import { CandidateType } from "~/schemas/candidate.schema";
import { paginate } from "~/utils/pagination";

class EmailTemplateRepository {
    getTemplateActive = async () => {
        return prisma.emailTemplate.findFirst({
            where: { status: true },
        });
    };
}
const emailTemplateRepository = new EmailTemplateRepository();
export default emailTemplateRepository;
