import type { MetaType } from "./common.types";

export interface Candidate {
    id: string;
    firstName: string;
    lastName: string;
    major: string;
    email: string;
    phone: string;
    semester: string;
    studentCode: string;
    isSendMail: boolean;
    note: string;
    createdAt: string;
    updatedAt: string;
}

export interface CandidateList {
    message: string;
    result: {
        data: Candidate[];
        meta: MetaType;
    };
}
export interface CandidateStatsType {
    message: string;
    result: {
        totalCandidates: number;
        receivedMailCount: number;
        notReceivedMailCount: number;
        candidatesCreatedToday: number;
        lastUpdatedCandidate: string;
        groupMajor: {
            major: string;
            count: number;
        }[];
        stats: {
            [key: string]: number;
        };
    };
}
