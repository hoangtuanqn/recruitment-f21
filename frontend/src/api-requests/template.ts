import publicApi from "~/lib/axios-instance";
import type { GetDetailTemplate, GetTemplateType, TestSendMailRequest } from "~/types/template.types";

class Template {
    static getAll = () => publicApi.get<GetTemplateType>("/template/get-all");
    static getStatus = () => publicApi.get<{ result: boolean }>("/template/check-status");
    static changeStatus = (status: boolean) =>
        publicApi.post<{ status: boolean }>("/template/change-status", { status });
    static getDetail = (id: string) => publicApi.get<GetDetailTemplate>(`/template/detail/${id}`);
    static create = (data: FormData) =>
        publicApi.post("/template/create", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    static update = (id: string, data: FormData) =>
        publicApi.post(`/template/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    static testSendMail = (templateId: string, data: TestSendMailRequest) =>
        publicApi.post("/template/test-send-mail", {
            templateId,
            ...data,
        });
}
export default Template;
