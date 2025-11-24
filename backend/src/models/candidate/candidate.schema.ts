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
