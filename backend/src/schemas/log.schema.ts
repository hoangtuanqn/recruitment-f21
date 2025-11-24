import { v7 as uuidv7 } from "uuid";

export interface LoginLogType {
    id?: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// 2. Class LoginLog
class LoginLog {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(log: LoginLogType) {
        this.id = log.id || uuidv7();
        this.email = log.email;
        this.createdAt = log.createdAt || new Date();
        this.updatedAt = log.updatedAt || new Date();
    }
}

export default LoginLog;
