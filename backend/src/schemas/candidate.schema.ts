import { v7 as uuidv7 } from "uuid";

export interface CandidateType {
    id?: string;
    firstName: string;
    lastName: string;
    major: string;
    email: string;
    phone: string;
    semester: string;
    studentCode: string;
    createdAt?: Date;
    updatedAt?: Date;
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
        this.studentCode = candidate.studentCode;
        this.createdAt = candidate.createdAt || new Date();
        this.updatedAt = candidate.updatedAt || new Date();
    }
}

export default Candidate;
