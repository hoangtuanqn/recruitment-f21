import { ExpiresInTokenType, TokenType } from "~/constants/enums";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import userRespository from "~/repositories/user.repository";
import AlgoCrypoto from "~/utils/crypto";
import AlgoJwt from "~/utils/jwt";
import { LoginRequestBody, RegisterRequestBody } from "~/models/requests/user.request";
import Helpers from "~/utils/helpers";
import redisClient from "~/configs/redis";
import prisma from "~/configs/prisma";
import LoginLog from "~/schemas/log.schema";

class AuthService {
    public create = async (data: RegisterRequestBody) => {
        const { email, password } = data;

        const emailExisted = await userRespository.findByEmail(email);
        if (emailExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.CONFLICT,
                message: "Địa chỉ email của bạn đã tồn tại trong hệ thống!",
            });
        }

        const passwordHash = await AlgoCrypoto.hashPassword(password);
        const result = await userRespository.create({
            email,
            password: passwordHash,
        });

        return await this.signAccesAndRefreshToken(result.id);
    };

    public login = async (data: LoginRequestBody) => {
        const { email, password } = data;
        const accountExisted = await userRespository.findByEmail(email);
        if (!accountExisted || !(await AlgoCrypoto.verifyPassword(password, accountExisted.password))) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Thông tin đăng nhập của bạn không hợp lệ!",
            });
        }
        await this.writeLogs(email);
        return await this.signAccesAndRefreshToken(accountExisted.id);
    };

    private signToken = ({
        userId,
        type,
        expiresIn = ExpiresInTokenType.AccessToken * 1000,
    }: {
        userId: string;
        type: TokenType;
        expiresIn?: number;
    }) => {
        return AlgoJwt.signToken({
            payload: { type, userId },
            options: { expiresIn: expiresIn * 1000 }, // convert seconds to mili seconds
        }) as Promise<string>;
    };

    private signAccesAndRefreshToken = async (userId: string) => {
        const [accessToken, refreshToken] = await Promise.all([
            this.signToken({
                userId,
                type: TokenType.AccessToken,
            }),
            this.signToken({
                userId,
                type: TokenType.RefreshToken,
                expiresIn: ExpiresInTokenType.RefreshToken,
            }),
        ]);

        // Lưu lại refresh token vào redis
        await redisClient.set(`refreshToken:${userId}`, refreshToken, ExpiresInTokenType.RefreshToken);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    };

    private writeLogs = (email: string) =>
        prisma.loginLog.create({
            data: new LoginLog({ email }),
        });
}
const authService = new AuthService();
export default authService;
