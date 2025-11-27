import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { Request, Response } from "express";

import { HTTP_STATUS } from "~/constants/httpStatus";
import templateService from "~/services/template.service";
import { TemplateEditRequest, TemplateUploadPayload, TestSendMailRequest } from "~/models/requests/template.requests";
import fs from "fs";
import path from "path";
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await templateService.getAll();
        return res.status(HTTP_STATUS.OK).json({
            message: "Đã lấy đữ liệu thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
export const getDetail = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log(id);

    try {
        const result = await templateService.getDetail(id);
        return res.status(HTTP_STATUS.OK).json({
            message: "Đã lấy đữ liệu thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
export const testSendMail = async (
    req: Request<ParamsDictionary, any, TestSendMailRequest>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await templateService.testSendMail(req.body);
        return res.status(HTTP_STATUS.OK).json({
            message: "Test send mail thành công!",
            result,
        });
    } catch (error) {
        console.log(error);

        return next(error);
    }
};
export const update = async (
    req: Request<{ id: string }, any, TemplateEditRequest>,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params;
    const fileName = req.file?.filename || "";

    console.log(req.body); // undefined

    try {
        const result = await templateService.update(id, req.body, fileName);
        return res.status(HTTP_STATUS.OK).json({
            message: "Đã cập nhật thành công!",
            result,
        });
    } catch (error) {
        console.log(error);

        return next(error);
    }
};
export const create = async (
    req: Request<ParamsDictionary, any, TemplateUploadPayload>,
    res: Response,
    next: NextFunction,
) => {
    const fileName = req.file?.filename as string;
    try {
        const result = await templateService.create(req.body, fileName);
        return res.status(HTTP_STATUS.OK).json({
            message: "Thêm template thành công!",
            result,
        });
    } catch (error) {
        const filePath = path.join(__dirname, "..", "..", "uploads", "templates", req.file?.filename || "");
        fs.unlinkSync(filePath);
        return next(error);
    }
};
export const checkStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await templateService.checkStatusSendMail();
        return res.status(HTTP_STATUS.OK).json({
            message: "Kiểm tra trạng thái thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};

export const changeStatus = async (
    req: Request<ParamsDictionary, any, { status: boolean }>,
    res: Response,
    next: NextFunction,
) => {
    const { status } = req.body;
    console.log(status);

    try {
        const result = await templateService.changeStatusSendEmail(status);
        return res.status(HTTP_STATUS.OK).json({
            message: "Cập nhật trạng thái thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
