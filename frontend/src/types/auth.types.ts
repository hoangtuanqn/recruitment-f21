export interface LoginResponseType {
    message: string;
    result?: {
        access_token: string;
        refresh_token: string;
    };
}
export interface LoginRequestType {
    email: string;
    password: string;
}

export interface RegisterRequestType {
    full_name: string;
    email: string;
    password: string;
    confirm_password: string;
    role: string;
}
export interface AccountType {
    id: string;
    fullName: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}
export interface GetAllAccountType {
    message: string;
    result: AccountType[];
}
