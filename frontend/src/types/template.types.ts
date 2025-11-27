export interface TemplateType {
    id: string;
    name: string;
    subject: string;
    values: { [key: string]: string }[];
    status: boolean;
    pathName: string;
    createdAt: string;
    updatedAt: string;
}
export interface GetTemplateType {
    message: string;
    result: TemplateType[];
}
export interface TestSendMailRequest {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}
export interface GetDetailTemplate {
    message: string;
    result: {
        id: string;
        name: string;
        pathName: string;
        subject: string;
        values: Array<{
            [key: string]: string;
        }>;
        status: boolean;
        createdAt: string;
        updatedAt: string;
    };
}
