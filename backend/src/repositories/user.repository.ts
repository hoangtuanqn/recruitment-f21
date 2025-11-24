import prisma from "~/configs/prisma";
import User from "~/schemas/user.schema";

class UserRepository {
    create = async (data: { email: string; password: string }) => {
        const result = await prisma.user.create({
            data: new User(data),
        });
        return result;
    };

    findByEmail = async (email: string) => {
        const result = await prisma.user.findUnique({
            where: { email },
        });
        return result;
    };

    findById = async (id: string) => {
        const result = await prisma.user.findUnique({
            where: { id },
        });
        return result;
    };

    changePassword = async (userId: string, newPassword: string) => {
        const result = await prisma.user.update({
            where: { id: userId },
            data: { password: newPassword },
        });
        return result;
    };
}
const userRespository = new UserRepository();
export default userRespository;
