import z from "zod/v3";

export const testSendMailSchema = z.object({
    body: z.object({
        templateId: z.string().uuid("ID template không hợp lệ"),
        firstName: z.string().min(1, "First Name phải có ít nhất 1 ký tự").max(50).optional(),
        lastName: z.string().min(1, "Last Name phải có ít nhất 1 ký tự").max(50).optional(),
        phone: z
            .string()
            .regex(/^\+?[0-9]{9,15}$/, "Số điện thoại không hợp lệ")
            .optional(),
        email: z.string({ required_error: "Email là bắt buộc" }).email("Địa chỉ Email không hợp lệ"),
    }),
});
// Dữ liệu trong Body
const templateUpdateBodySchema = z.object({
    name: z.string().min(3).max(255).optional(),
    subject: z.string().min(5).max(255).optional(),
    status: z.union([z.literal("1"), z.literal("0")]).optional(),
    parameters: z.string().optional(),
});
export const templateAddSchema = z.object({
    body: templateUpdateBodySchema,
});
const templateQuerySchema = z.object({
    id: z.string().uuid(),
});
export const templateEditSchema = z.object({
    params: templateQuerySchema,
    body: templateUpdateBodySchema,
});
