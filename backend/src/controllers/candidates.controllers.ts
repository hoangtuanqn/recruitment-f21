import { NextFunction, ParamsDictionary } from "express-serve-static-core";
import { Request, Response } from "express";

import { HTTP_STATUS } from "~/constants/httpStatus";
import candidateService from "~/services/candidate.service";
import { GetAllRequestQuery } from "~/models/requests/candidate.request";
import ExcelJS from "exceljs";
export const create = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    try {
        const filePath = req.file?.path ?? null;
        const result = await candidateService.handleRawData(req.body, filePath);
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
        const result = await candidateService.getAll(+page, +limit);
        return res.status(HTTP_STATUS.OK).json({
            message: "Đã lấy đữ liệu thành công!",
            result,
        });
    } catch (error) {
        return next(error);
    }
};
export const exportExcel = async (req: Request, res: Response, next: NextFunction) => {
    // 1. Khởi tạo Workbook
    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();

    // 2. Thêm một Worksheet (Sheet) mới
    const worksheet = workbook.addWorksheet("Candidates");

    // 3. Định nghĩa tiêu đề cột (Columns)
    worksheet.columns = [
        { header: "STT", key: "id", width: 5 },
        { header: "Last Name", key: "name", width: 30 },
        { header: "First Name", key: "age", width: 10 },
        { header: "Phone", key: "email", width: 40 },
        { header: "Email", key: "email", width: 40 },
        { header: "Student Code", key: "email", width: 40 },
        { header: "Major", key: "email", width: 40 },
    ];

    // 4. Thêm Dữ liệu (Rows)
    const users = [
        { id: 1, name: "Nguyễn Văn A", age: 28, email: "nguyenvana@example.com" },
        { id: 2, name: "Trần Thị B", age: 35, email: "tranb@example.com" },
        { id: 3, name: "Lê Văn C", age: 22, email: "levanc@example.com" },
    ];

    worksheet.addRows(users);

    // 5. Cài đặt Header HTTP cho file Excel
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=" + "DuLieuNguoiDung.xlsx");

    // 6. Ghi Workbook vào Response stream
    try {
        await workbook.xlsx.write(res);
        res.end();
        console.log("File Excel đã được gửi thành công.");
    } catch (error) {
        console.error("Lỗi khi ghi file Excel:", error);
        res.status(500).send("Lỗi máy chủ khi tạo file Excel.");
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
