export interface TemplateType {
    id: string;
    name: string;
    subject: string;
    round: keyof RoundType;
    result: keyof ResultType;
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
export interface RoundType {
    ROUND_1: string;
    ROUND_2: string;
    ROUND_3: string;
}
export interface ResultType {
    PASSED: string;
    FAILED: string;
}
export interface GetDetailTemplate {
    message: string;
    result: {
        id: string;
        name: string;
        pathName: string;
        subject: string;
        round: RoundType;
        result: ResultType;
        values: Array<{
            [key: string]: string;
        }>;
        status: boolean;
        createdAt: string;
        updatedAt: string;
    };
}
