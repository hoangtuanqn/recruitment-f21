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
const app = express();
const PORT = process.env.PORT || 8000;
app.use(
    cors({
        origin: process.env.NODE_ENV === "development" ? "http://localhost:5173" : process.env.CLIENT_URL,
        credentials: true,
    }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/candidate", candidateRouter);
app.use("/logs", logRouter);
app.use(defaultErrorHandler);
app.use(defaultSuccessHandler);

app.listen(PORT, () => {
    console.log(`Server successfully launched on PORT ${PORT}!`);
});
