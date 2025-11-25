import { ExpiresInTokenType, TokenType, RoleType } from "~/constants/enums";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import userRespository from "~/repositories/user.repository";
import AlgoCrypoto from "~/utils/crypto";
import AlgoJwt from "~/utils/jwt";
import { LoginRequestBody, RegisterRequestBody } from "~/models/requests/user.request";

import logRepository from "~/repositories/log.repository";

class AuthService {
    public create = async (data: RegisterRequestBody) => {
        const { full_name, email, password, role } = data;

        const emailExisted = await userRespository.findByEmail(email);
        if (emailExisted) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.CONFLICT,
                message: "Địa chỉ email của bạn đã tồn tại trong hệ thống!",
            });
        }

        const passwordHash = await AlgoCrypoto.hashPassword(password);
        const result = await userRespository.create({
            fullName: full_name,
            email,
            password: passwordHash,
            role: role === "VIEWER" ? RoleType.VIEWER : RoleType.EDITOR,
        });

        return await this.signAccesAndRefreshToken(result.id, result.role as RoleType);
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
        await logRepository.writeLogs(accountExisted.id, `Đã đăng nhập vào hệ thống!`);
        return await this.signAccesAndRefreshToken(accountExisted.id, accountExisted.role as RoleType);
    };

    public me = async (id: string) => {
        const user = await userRespository.findById(id);
        if (!user) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Thông tin đăng nhập của bạn không hợp lệ!",
            });
        }
        return user;
    };
    public getAll = async () => {
        const result = await userRespository.getAll();
        return result;
    };

    private signToken = ({
        userId,
        type,
        expiresIn = ExpiresInTokenType.AccessToken * 1000,
        role,
    }: {
        userId: string;
        type: TokenType;
        expiresIn?: number;
        role: RoleType;
    }) => {
        return AlgoJwt.signToken({
            payload: { type, userId, role },
            options: { expiresIn: expiresIn * 1000 }, // convert seconds to mili seconds
        }) as Promise<string>;
    };

    private signAccesAndRefreshToken = async (userId: string, role: RoleType) => {
        const [accessToken, refreshToken] = await Promise.all([
            this.signToken({
                userId,
                role,
                type: TokenType.AccessToken,
            }),
            this.signToken({
                userId,
                role,
                type: TokenType.RefreshToken,
                expiresIn: ExpiresInTokenType.RefreshToken,
            }),
        ]);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    };
}
const authService = new AuthService();
export default authService;
