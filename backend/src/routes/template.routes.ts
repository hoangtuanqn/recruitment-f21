import { Router } from "express";
import * as templateController from "~/controllers/template.controllers";
import { auth, isRole } from "~/middlewares/auth.middlewares";
import upload from "~/middlewares/multer";
import { templateAddSchema, templateEditSchema, testSendMailSchema } from "~/models/rules/template.schema";
import { validate } from "~/utils/validation";

const templateRouter = Router();
// định nghĩa routing
templateRouter.get("/get-all", auth, isRole(["ADMIN"]), templateController.getAll);
templateRouter.get("/detail/:id", auth, isRole(["ADMIN"]), templateController.getDetail);
templateRouter.post(
    "/create",
    auth,
    isRole(["ADMIN"]),
    validate(templateAddSchema),
    upload("/templates").single("file"),
    templateController.create,
);
templateRouter.patch("/:id", auth, isRole(["ADMIN"]), validate(templateEditSchema), templateController.update);
templateRouter.post(
    "/test-send-mail",
    auth,
    isRole(["ADMIN"]),
    validate(testSendMailSchema),
    templateController.create,
);

export default templateRouter;
