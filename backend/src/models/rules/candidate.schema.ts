import z from "zod/v3";
const toPositiveInt = z
    .string()
    .transform((val) => {
        const num = parseInt(val, 10);
        return isNaN(num) ? val : num;
    })
    .pipe(z.number().min(1));
export const getAllCandidateQuerySchema = z.object({
    query: z.object({
        limit: toPositiveInt.default("10"),
        page: toPositiveInt.default("1"),
    }),
});

export const confirmSendMailSchema = z.object({
    body: z.object({
        ids: z
            .array(
                z
                    .string({
                        required_error: "UUID is required",
                        invalid_type_error: "UUID must be a string",
                    })
                    .uuid("Invalid UUID format"),
            )
            .min(1, "The 'ids' array must not be empty"), // Tùy chọn: Đảm bảo mảng không rỗng
    }),
});
