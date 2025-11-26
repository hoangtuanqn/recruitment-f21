import { validate } from "~/utils/validation";
import { Router } from "express";
import multer from "multer";
import * as candidateController from "~/controllers/candidates.controllers";
import { confirmSendMailSchema, getAllCandidateQuerySchema } from "~/models/candidate/candidate.schema";
import { auth, isRole } from "~/middlewares/auth.middlewares";

const candidateRouter = Router();
const upload = multer({ dest: "uploads/" });
// định nghĩa routing
candidateRouter.get("/stats", auth, candidateController.stats);
candidateRouter.get("/get-all", auth, validate(getAllCandidateQuerySchema), candidateController.getAll);
candidateRouter.post(
    "/confirm-send-mail",
    auth,
    isRole(["ADMIN", "EDITOR"]),
    validate(confirmSendMailSchema),
    candidateController.confirmSendMail,
);
candidateRouter.post("/create", auth, isRole(["ADMIN"]), upload.single("file"), candidateController.create);
candidateRouter.get("/export-excel", auth, isRole(["ADMIN", "EDITOR"]), candidateController.exportExcel);
candidateRouter.get("/send-email", candidateController.sendMail);
export default candidateRouter;
