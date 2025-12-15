import { v7 as uuidv7 } from "uuid";
import { ResultType, RoundType } from "~/constants/enums";

export interface EmailTemplateType {
    id?: string;
    name: string;
    pathName: string;
    subject: string;
    round: RoundType;
    result: ResultType;
    values: { [key: string]: any };
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// 2. Class Candidate
class EmailTemplate {
    id: string;
    name: string;
    pathName: string;
    subject: string;
    round: RoundType;
    result: ResultType;
    values: { [key: string]: any };
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(tempate: EmailTemplateType) {
        this.id = tempate.id || uuidv7();
        this.name = tempate.name;
        this.pathName = tempate.pathName;
        this.subject = tempate.subject;
        this.round = tempate.round;
        this.result = tempate.result;
        this.values = tempate.values;
        this.status = tempate.status || false;
        this.createdAt = tempate.createdAt || new Date();
        this.updatedAt = tempate.updatedAt || new Date();
    }
}

export default EmailTemplate;
