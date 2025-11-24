import ExcelJS from "exceljs";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import { RegisterRequestBody } from "~/models/requests/user.request";
import Candidate, { CandidateType } from "~/schemas/candidate.schema";
import Helpers from "~/utils/helpers";
import fs from "fs";
import candidateRepository from "~/repositories/candidate.";

class CandidateService {
    public getAll = async (page: number, limit: number) => await candidateRepository.getCandidates(page, limit);
    public handleRawData = async (data: RegisterRequestBody, filePath: string | null) => {
        if (!filePath)
            throw new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: "Vui lòng tải lên file DATA" });
        const candidates = this.handleFileData(filePath);
        return candidateRepository.createMany(candidates);
    };

    public exportData = () => {
       
    };

    private handleFileData = (filePath: string): CandidateType[] => {
        const candidates: CandidateType[] = [];

        try {
            const fileContent = fs.readFileSync(filePath, "utf8");
            const rawSplit = fileContent.split("\n");
            for (let item of rawSplit) {
                const splitTab = item.split("\t");
                for (let i = 1; i <= 7; ++i) {
                    splitTab[i] = Helpers.filterRawInfo(splitTab[i].trim());
                }
                candidates.push(
                    new Candidate({
                        firstName: splitTab[1],
                        lastName: splitTab[2],
                        major: splitTab[3],
                        email: splitTab[4],
                        phone: splitTab[5],
                        semester: splitTab[6],
                        studentCode: splitTab[7],
                    }),
                );
            }
            return candidates;
        } catch (error) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: "Không thể đọc được dữ liệu từ file",
            });
        }
    };
}
const candidateService = new CandidateService();
export default candidateService;
