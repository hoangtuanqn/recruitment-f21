import { v7 as uuidv7 } from "uuid";
import { RoundType } from "~/constants/enums";

export interface CandidateType {
    id?: string;
    firstName: string;
    lastName: string;
    major: string;
    email: string;
    phone: string;
    semester: string;
    studentCode: string;
    note?: string;
    isSendMail?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface CandidateScore {
    email: string;
    round: RoundType;
    score: number;
}

// 2. Class Candidate
class Candidate {
    id: string;
    firstName: string;
    lastName: string;
    major: string;
    email: string;
    phone: string;
    semester: string;
    studentCode: string;
    note: string;
    isSendMail: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(candidate: CandidateType) {
        this.id = candidate.id || uuidv7();
        this.firstName = candidate.firstName;
        this.lastName = candidate.lastName;
        this.major = candidate.major;
        this.email = candidate.email;
        this.phone = candidate.phone;
        this.semester = candidate.semester;
        this.note = candidate.note || "";
        this.isSendMail = candidate.isSendMail || false;
        this.studentCode = candidate.studentCode;
        this.createdAt = candidate.createdAt || new Date();
        this.updatedAt = candidate.updatedAt || new Date();
    }
}

export default Candidate;
