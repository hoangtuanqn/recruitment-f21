import { v7 as uuidv7 } from "uuid";
import { RoundType, ScoreResultType as SRT } from "~/constants/enums";

interface ScoreResultType {
    id?: string;
    candidateId: string;
    round: RoundType;
    score: JSON;
    result?: SRT;
    createdAt?: Date;
    updatedAt?: Date;
}

class ScoreResult {
    id: string;
    candidateId: string;
    round: RoundType;
    score: JSON;
    result?: SRT;
    createdAt: Date;
    updatedAt: Date;
    constructor(score: ScoreResultType) {
        this.id = score.id || uuidv7();
        this.candidateId = score.candidateId;
        this.round = score.round || RoundType.ROUND_REGISTER;
        this.score = score.score || "{}";
        this.result = score.result || SRT.PENDING;
        this.createdAt = score.createdAt || new Date();
        this.updatedAt = score.updatedAt || new Date();
    }
}

export default ScoreResult;
