import { Router } from "express";
import * as templateController from "~/controllers/template.controllers";
import { auth, isRole } from "~/middlewares/auth.middlewares";
import upload from "~/middlewares/multer";
import { testSendMailSchema } from "~/models/rules/template.schema";
import { validate } from "~/utils/validation";

const templateRouter = Router();
// định nghĩa routing
templateRouter.get("/get-all", auth, isRole(["ADMIN"]), templateController.getAll);
templateRouter.get("/detail/:id", auth, isRole(["ADMIN"]), templateController.getDetail);
templateRouter.post(
    "/create",
    auth,
    isRole(["ADMIN"]),
    // validate(templateAddSchema),
    upload("/templates").single("file"),
    templateController.create,
);
templateRouter.get("/check-status", auth, isRole(["ADMIN"]), templateController.checkStatus);
templateRouter.post("/change-status", auth, isRole(["ADMIN"]), templateController.changeStatus);
templateRouter.post(
    "/test-send-mail",
    auth,
    isRole(["ADMIN"]),
    validate(testSendMailSchema),
    templateController.testSendMail,
);
templateRouter.post("/:id", auth, isRole(["ADMIN"]), upload("/templates").single("file"), templateController.update);

export default templateRouter;
