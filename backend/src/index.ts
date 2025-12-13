import express from "express";
import "dotenv/config"; // thêm cái này để có thể sử dụng biến môi trường (nếu k sẽ là underfined), import ở file này thì tất cả file con đều được áp dụng
import { defaultErrorHandler } from "./middlewares/error.middlewares";
import { defaultSuccessHandler } from "./middlewares/success.middlewares";
import authRouter from "./routes/auth.routes";
import cors from "cors";
import candidateRouter from "./routes/candidate.route";
import cookieParser from "cookie-parser";
import logRouter from "./routes/log.route";
import "./configs/env";
import templateRouter from "./routes/template.routes";
import "./cron-job/send-mail";
import scoreRouter from "./routes/score.routes";
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.static("uploads"));
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : process.env.CLIENT_URL,
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/candidate", candidateRouter);
app.use("/template", templateRouter);
app.use("/logs", logRouter);
app.use("/score", logRouter);
app.use("/score", scoreRouter);
app.use(defaultErrorHandler);
app.use(defaultSuccessHandler);
app.listen(PORT, () => {
    console.log(`Server successfully launched on PORT ${PORT}!`);
});
