import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { Request, Response } from "express";
import { HTTP_STATUS } from "~/constants/httpStatus";
import logService from "~/services/log.service";

export const getAll = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    try {
        const result = await logService.getAll();
        return res.status(HTTP_STATUS.OK).json({
            message: "Lấy lịch sử log thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
