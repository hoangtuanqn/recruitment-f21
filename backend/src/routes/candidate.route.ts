import { validate } from "~/utils/validation";
import { Router } from "express";
import multer from "multer";
import * as candidateController from "~/controllers/candidates.controllers";
import { getAllCandidateQuerySchema } from "~/models/candidate/candidate.schema";

const candidateRouter = Router();
const upload = multer({ dest: "uploads/" });
// định nghĩa routing
candidateRouter.get("/get-all", validate(getAllCandidateQuerySchema), candidateController.getAll);
candidateRouter.post("/create", upload.single("file"), candidateController.create);
candidateRouter.get("/export-excel", candidateController.exportExcel);
export default candidateRouter;
