export const MAX_HISTORY_PASSWORD = 5;
export enum UserVerifyStatus {
    Unverifyed, // giá trị là: 0
    Verified, // 1
    Banned, // 2
}
export enum TokenType {
    // Lưu ý: Không được thay đổi thứ tự enum tránh lỗi token đã được cấp phát ngoài kia
    AccessToken,
    RefreshToken,
    ForgotPasswordToken,
    EmailVerifyToken,
}
export enum RoleType {
    ADMIN = "ADMIN",
    VIEWER = "VIEWER",
    EDITOR = "EDITOR",
}
export enum ExpiresInTokenType {
    AccessToken = 2 * 60 * 60, // 2 giờ
    RefreshToken = 30 * 24 * 60 * 60, // 30 ngày
    ForgotPasswordToken = 15 * 60, // 15 phút
    EmailVerifyToken = 7 * 24 * 60 * 60, // 7 ngày
}
export enum RoundType {
    ROUND_REGISTER = "ROUND_REGISTER",
    ROUND_1 = "ROUND_1",
    ROUND_2 = "ROUND_2",
    ROUND_3 = "ROUND_3",
}
export enum ScoreResultType {
    PASSED = "PASSED",
    FAILED = "FAILED",
    PENDING = "PENDING",
}
