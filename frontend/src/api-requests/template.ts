import publicApi from "~/lib/axios-instance";
import type { GetDetailTemplate, GetTemplateType, TestSendMailRequest } from "~/types/template.types";

class Template {
    static getAll = () => publicApi.get<GetTemplateType>("/template/get-all");
    static getDetail = (id: string) => publicApi.get<GetDetailTemplate>(`/template/detail/${id}`);
    static create = (data: FormData) =>
        publicApi.post("/template/create", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    static update = (id: string, data: FormData) => publicApi.patch(`/template/${id}`, data);
    static testSendMail = (templateId: string, data: TestSendMailRequest) =>
        publicApi.post("/template/test-send-mail", {
            templateId,
            ...data,
        });
}
export default Template;
