import { omit } from "lodash";
import prisma from "~/configs/prisma";
import { RoleType } from "~/constants/enums";
import User from "~/schemas/user.schema";

class UserRepository {
    create = async (data: { fullName: string; email: string; password: string; role: RoleType }) => {
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
            omit: {
                password: true,
            },
            where: {
                id,
            },
        });
        return result;
    };
    getAll = async () => {
        const result = await prisma.user.findMany({ omit: { password: true } });
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
