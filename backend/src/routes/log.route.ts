import { Router } from "express";
import * as logController from "~/controllers/log.controllers";
import { auth, isRole } from "~/middlewares/auth.middlewares";

const logRouter = Router();
// định nghĩa routing
logRouter.get("/get-all", auth, isRole(["ADMIN", "EDITOR"]), logController.getAll);

export default logRouter;
