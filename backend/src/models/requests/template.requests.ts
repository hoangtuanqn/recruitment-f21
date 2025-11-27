import z from "zod/v3";
import { templateEditSchema, testSendMailSchema } from "../rules/template.schema";

export type TemplateParameter = {
    key: string;
    value: string;
    defaultValue: string;
};
export type TemplateUploadPayload = {
    name: string;
    subject: string;
    status: "1" | "0";
    file: File;
    parameters: string;
};
export type TestSendMailRequest = z.infer<typeof testSendMailSchema>["body"];
export type TemplateEditRequest = z.infer<typeof templateEditSchema>["body"];
