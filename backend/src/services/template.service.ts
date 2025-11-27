import { getDetail } from "./../controllers/template.controllers";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import {
    TemplateEditRequest,
    TemplateParameter,
    TemplateUploadPayload,
    TestSendMailRequest,
} from "~/models/requests/template.requests";
import emailTemplateRepository from "~/repositories/email-template.repository";
import emailService from "./email.service";
import candidateService from "./candidate.service";
import { EmailTemplateType } from "~/schemas/email-tempate";
import settingRepository from "~/repositories/setting.repository";

class TemplateService {
    public getAll = async () => {
        const data = await emailTemplateRepository.gettAll();
        return data;
    };
    public create = async (payload: TemplateUploadPayload, fileName: string) => {
        const { name, subject, status, parameters } = payload;
        const paramsParse = JSON.parse(parameters) as TemplateParameter[];
        const values = paramsParse.map((item) => ({
            [item.key]: item.value === "other" ? item.defaultValue : item.value,
        }));
        if ((await emailTemplateRepository.countActive()) > 1) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.CONFLICT,
                message: "Chỉ được phép có 1 template hoạt động chính!",
            });
        }

        try {
            await emailTemplateRepository.create({
                name,
                subject,
                status,
                path_name: fileName,
                values,
            });
        } catch (error) {
            console.log(error);
        }
    };

    public testSendMail = async (payload: TestSendMailRequest) => {
        const { templateId, email } = payload;
        const template = await emailTemplateRepository.findById(templateId);
        const info = await candidateService.getInfoCandidates(template as EmailTemplateType);
        console.log(info[email].data);
        await emailService.sendMail(email, info[email].data, { subject: template?.subject! });
    };
    public getDetail = async (id: string) => {
        return await emailTemplateRepository.findById(id);
    };
    public update = async (id: string, payload: TemplateEditRequest, fileName: string) => {
        payload.parameters = JSON.parse(payload.parameters as string);
        return await emailTemplateRepository.update(id, payload, fileName);
    };

    public changeStatusSendEmail = async (status: boolean) => {
        return await emailTemplateRepository.changeStatus(status);
    };
    public checkStatusSendMail = async () => {
        return (await settingRepository.get("send_mail_auto"))?.value === "1";
    };
}
const templateService = new TemplateService();
export default templateService;
