import prisma from "~/configs/prisma";
import { ResultType, RoundType } from "~/constants/enums";
import EmailTemplate from "~/schemas/email-tempate";
interface TemplateCreateType {
    name: string;
    subject: string;
    round: RoundType;
    result: ResultType;
    status: "1" | "0";
    path_name: string;
    values: any;
}
class EmailTemplateRepository {
    getTemplateActive = async () => {
        return prisma.emailTemplate.findFirst({
            where: { status: true },
        });
    };
    getTemplate = async (round: RoundType, result: ResultType) => {
        return prisma.emailTemplate.findFirst({
            where: {
                status: true,
                round,
                result,
            },
        });
    };
    countActive = async () => {
        return prisma.emailTemplate.count({
            where: { status: true },
        });
    };
    gettAll = async () => {
        return prisma.emailTemplate.findMany();
    };
    create = async (data: TemplateCreateType) => {
        console.log("create template", data);

        console.log("có path name", data.path_name);
        return prisma.emailTemplate.create({
            data: new EmailTemplate({
                name: data.name,
                subject: data.subject,
                round: data.round,
                result: data.result,
                values: data.values,
                pathName: data.path_name,
                status: data.status === "1",
            }),
        });
    };

    findById = async (id: string) => {
        return prisma.emailTemplate.findUnique({
            where: { id },
        });
    };
    update = async (id: string, payload: any, fileName: string) => {
        const update = {
            name: payload.name,
            subject: payload.subject,
            round: payload.round,
            result: payload.result,
            values: payload.parameters,
            status: payload.status === "1",
        };
        if (fileName) {
            Object.assign(update, { pathName: fileName });
        }
        return prisma.emailTemplate.update({
            where: { id },
            data: update,
        });
    };

    changeStatus = async (status: boolean) => {
        return prisma.settings.upsert({
            where: {
                name: "send_mail_auto",
            },
            update: {
                value: status ? "1" : "0",
            },
            create: {
                name: "send_mail_auto",
                value: status ? "1" : "0",
            },
        });
    };
}
const emailTemplateRepository = new EmailTemplateRepository();
export default emailTemplateRepository;
