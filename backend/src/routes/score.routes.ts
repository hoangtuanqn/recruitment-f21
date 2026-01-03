import { Router } from "express";
import multer from "multer";
import * as scoreController from "~/controllers/score.controllers";
import { auth, isRole } from "~/middlewares/auth.middlewares";

const scoreRouter = Router();
const upload = multer({ dest: "uploads/" });
// scoreRouter.post("/create", auth, isRole(["ADMIN"]), upload.single("file"), scoreController.create);
scoreRouter.post("/create-round2", auth, isRole(["ADMIN"]), upload.single("file"), scoreController.create_round2);
// scoreRouter.get("/submit", scoreController.submit);
export default scoreRouter;
