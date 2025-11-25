import type { MetaType } from "./common.types";

export interface LogType {
    id: string;
    userId: string;
    note: string;
    user: {
        fullName: string;
    };
    createdAt: string;
    updatedAt: string;
}
export interface GetAllLogType {
    message: string;
    result: {
        data: LogType[];
        meta: MetaType;
    };
}
