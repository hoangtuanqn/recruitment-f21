import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { Request, Response } from "express";
import { HTTP_STATUS } from "~/constants/httpStatus";
import candidateService from "~/services/candidate.service";
import scoreService from "~/services/score.service";

export const create = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const userId = req.userId as string;
    try {
        const filePath = req.file?.path ?? null;
        const result = await scoreService.handleScoreRawData(userId, filePath);
        return res.status(HTTP_STATUS.OK).json({
            message: "Đã xử lý dữ liệu thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
