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
    ]);
    const data = await candidateService.getAll(+page || 1, +limit || 20);

    workbook.setupData(data.data);

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
export const sendMail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const start = Date.now();
        await candidateService.sendMail();
        const end = Date.now();
        console.log((end - start) / 1000);

        return res.json({
            message: "Đã gửi email thành công",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
// export const refreshToken = async (
//     req: Request<ResetPasswordRequestParams, any, RefreshTokenRequestBody>,
//     res: Response,
//     next: NextFunction,
// ) => {
//     const { token } = req.body;
//     const userId = req.userId as string;
//     try {
//         const result = await userService.refreshToken(userId, token);
//         return res.status(HTTP_STATUS.OK).json({
//             message: "Cấp lại token mới thành công!",
//             result,
//         });
//     } catch (error) {
//         return next(error);
//     }
// };
