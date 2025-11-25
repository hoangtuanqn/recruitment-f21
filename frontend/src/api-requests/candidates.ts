import publicApi from "~/lib/axios-instance";
import type { CandidateList, CandidateStatsType } from "~/types/candidate.types";

class Candidate {
    static getAll = (page: number = 1, limit: number = 20) =>
        publicApi.get<CandidateList>(`/candidate/get-all?page=${page}&limit=${limit}`);
    static stats = () => publicApi.get<CandidateStatsType>("/candidate/stats");
    static confirmSendMail = (data: string[]) => publicApi.post("/candidate/confirm-send-mail", { ids: data });
}
export default Candidate;
