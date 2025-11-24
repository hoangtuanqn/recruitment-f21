import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { Request, Response } from "express";
import { LoginRequestBody, RegisterRequestBody } from "~/models/requests/user.request";
import userService from "~/services/user.service";
import { HTTP_STATUS } from "~/constants/httpStatus";

export const register = async (
    req: Request<ParamsDictionary, any, RegisterRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await userService.create(req.body);
        return res.status(HTTP_STATUS.CREATED).json({
            message: "Bạn đã đăng ký tài khoản thành công trên hệ thống!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};

export const login = async (
    req: Request<ParamsDictionary, any, LoginRequestBody>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await userService.login(req.body);
        return res.status(HTTP_STATUS.OK).json({
            message: "Bạn đã đăng nhập thành công!",
            result,
        });
    } catch (error) {
        return next(error);
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
