import { confirmSendMailSchema, getAllCandidateQuerySchema } from "~/models/candidate/candidate.schema";
import z from "zod/v3";

export type GetAllRequestQuery = z.infer<typeof getAllCandidateQuerySchema>["query"];
export type ConfirmSendMailBody = z.infer<typeof confirmSendMailSchema>["body"];
