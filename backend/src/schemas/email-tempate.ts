import { v7 as uuidv7 } from "uuid";

export interface EmailTemplateType {
    id?: string;
    name: string;
    subject: string;
    values: { [key: string]: any };
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// 2. Class Candidate
class EmailTemplate {
    id: string;
    name: string;
    subject: string;
    values: { [key: string]: any };
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(tempate: EmailTemplateType) {
        this.id = tempate.id || uuidv7();
        this.name = tempate.name;
        this.subject = tempate.subject;
        this.values = tempate.values;
        this.status = tempate.status || false;
        this.createdAt = tempate.createdAt || new Date();
        this.updatedAt = tempate.updatedAt || new Date();
    }
}

export default EmailTemplate;
