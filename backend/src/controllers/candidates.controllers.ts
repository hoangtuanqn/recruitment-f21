import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { Request, Response } from "express";

import { HTTP_STATUS } from "~/constants/httpStatus";
import candidateService from "~/services/candidate.service";
import { ConfirmSendMailBody, GetAllRequestQuery } from "~/models/requests/candidate.request";
import GenerateFileExcel from "~/utils/worksheet";
export const create = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const userId = req.userId as string;
    try {
        const filePath = req.file?.path ?? null;
        const result = await candidateService.handleRawData(userId, filePath);
        return res.status(HTTP_STATUS.OK).json({
            message: "Đã xử lý dữ liệu thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.query as unknown as GetAllRequestQuery;

    try {
        const result = await candidateService.getAll(+page || 1, +limit || 20);
        if (req.role === "VIEWER") {
            for (let i = 0; i < result.data.length; ++i) {
                delete result.data[i].phone;
                delete result.data[i].email;
            }
        }
        return res.status(HTTP_STATUS.OK).json({
            message: "Đã lấy đữ liệu thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
export const confirmSendMail = async (
    req: Request<ParamsDictionary, any, ConfirmSendMailBody>,
    res: Response,
    next: NextFunction,
) => {
    const { ids } = req.body;
    const userId = req.userId as string;

    try {
        const result = await candidateService.confirmSendMail(userId, ids);
        return res.status(HTTP_STATUS.OK).json({
            message: "Đã cập nhật dữ liệu thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
export const changeStatusScore = async (
    req: Request<ParamsDictionary, any, { studentCode: string; status: "PASSED" | "FAILED" }>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await candidateService.changeStatusScore(req.body.studentCode, req.body.status);
        return res.status(HTTP_STATUS.OK).json({
            message: "Đã cập nhật dữ liệu thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
export const stats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await candidateService.getCandidateStats();
        return res.status(HTTP_STATUS.OK).json({
            message: "Lấy số liệu thống kê thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
export const exportExcel = async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.query as { page: string; limit: string };
    const workbook = new GenerateFileExcel("Candidates");
    workbook.setupColumns([
        { header: "Last Name", key: "lastName", width: 20 },
        { header: "First Name", key: "firstName", width: 20 },
        { header: "Phone", key: "phone", width: 20 },
        { header: "Email", key: "email", width: 40 },
        { header: "Student Code", key: "studentCode", width: 15 },
        { header: "Major", key: "major", width: 30 },
        { header: "Semester", key: "semester", width: 30 },

        { header: "Score 1", key: "score1", width: 10 },
        { header: "Score 2", key: "score2", width: 10 },
        { header: "Score 3", key: "score3", width: 10 },
        { header: "Score 4", key: "score4", width: 10 },
        { header: "Score 5", key: "score5", width: 10 },
        { header: "Trung bình ", key: "averageScore", width: 10 },
        { header: "Lần nộp", key: "submissionCount", width: 10 },
        { header: "Kết quả", key: "result", width: 20 },
        { header: "Résumé lần đầu", key: "firstSubmit", width: 20 },
        { header: "Résumé lần cuối", key: "finalSubmit", width: 20 },
    ]);
    const data = await candidateService.getAll(+page || 1, +limit || 20);
    const dataNew = data.data.map((item) => {
        const score = {
            score1: item.scoreResults[0]?.score?.[0]?.score || 0,
            score2: item.scoreResults[0]?.score?.[1]?.score || 0,
            score3: item.scoreResults[0]?.score?.[2]?.score || 0,
            score4: item.scoreResults[0]?.score?.[3]?.score || 0,
            score5: item.scoreResults[0]?.score?.[4]?.score || 0,
        };
        const averageScore =
            ((score.score1 + score.score2 + score.score3 + score.score4 + score.score5) * 1.0) /
            (item.scoreResults[0]?.score?.length ?? 1);
        return {
            ...item,
            ...score,
            averageScore: averageScore.toFixed(2),
            submissionCount: item.scoreResults[0]?.score?.length || 0,
            result: item.scoreResults[0]?.result || "FAILED",
            firstSubmit: item.scoreResults[0]?.firstSubmit,
            finalSubmit: item.scoreResults[0]?.finalSubmit,
        };
    });
    workbook.setupData(dataNew);

    workbook.setHeader(res);

    try {
        await workbook.execute(res);
        res.end();
        console.log("File Excel đã được gửi thành công.");
    } catch (error) {
        console.error("Lỗi khi ghi file Excel:", error);
        res.status(500).send("Lỗi máy chủ khi tạo file Excel.");
    }
};
// export const sendMail = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const start = Date.now();
//         await candidateService.sendMail();
//         const end = Date.now();
//         console.log((end - start) / 1000);

//         return res.json({
//             message: "Đã gửi email thành công",
//         });
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };
