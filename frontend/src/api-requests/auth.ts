import publicApi from "~/lib/axios-instance";
import type { GetAllAccountType, LoginRequestType, LoginResponseType, RegisterRequestType } from "~/types/auth.types";

class Auth {
    static login = (data: LoginRequestType) => publicApi.post<LoginResponseType>("/auth/login", data);
    static create = (data: RegisterRequestType) => publicApi.post<LoginResponseType>("/auth/register", data);
    static getAll = () => publicApi.get<GetAllAccountType>("/auth/get-all");
}
export default Auth;
