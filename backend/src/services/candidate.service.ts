import { changeStatusScore } from "./../controllers/candidates.controllers";
import fs from "fs";
import { HTTP_STATUS } from "~/constants/httpStatus";
import { ErrorWithStatus } from "~/models/Error";
import Candidate, { CandidateScore, CandidateType } from "~/schemas/candidate.schema";
import Helpers from "~/utils/helpers";
import candidateRepository from "~/repositories/candidate.repository";
import prisma from "~/configs/prisma";
import logRepository from "~/repositories/log.repository";
import userRespository from "~/repositories/user.repository";
import redisClient from "~/configs/redis";
import emailService from "./email.service";
import emailTemplateRepository from "~/repositories/email-template.repository";
import { EmailTemplateType } from "~/schemas/email-tempate";
import settingRepository from "~/repositories/setting.repository";
import { ResultType, RoundType } from "~/constants/enums";

interface InfoTestEmailType {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    studentCode: string;
}
class CandidateService {
    public getAll = async (page: number = 1, limit: number = 20) => {
        const data = await candidateRepository.getCandidates(page, limit);
        return data;
    };
    public handleRawData = async (userId: string, filePath: string | null) => {
        if (!filePath)
            throw new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: "Vui lòng tải lên file DATA" });
        const candidates = await this.handleFileData(userId, filePath);
        const result = await candidateRepository.createMany(candidates);
        const studentsCode = candidates.map((item) => item.studentCode);
        await candidateRepository.deleteMany(studentsCode);
        await candidateRepository.updateCreatedAtFirst(studentsCode[0]);
        return result;
    };

    public confirmSendMail = async (userId: string, ids: string[]) => {
        const user = await userRespository.findById(userId);
        if (user) {
            await candidateRepository.confirmSendMail(ids);
            await logRepository.writeLogs(user.id, `Đã đăng nhập vào hệ thống!`);
        } else {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Người dùng không tồn tại trong hệ thống!",
            });
        }
    };

    public changeStatusScore = async (studentCode: string, status: "PASSED" | "FAILED") => {
        const candidate = await candidateRepository.findByStudentCode(studentCode);
        if (!candidate) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Không tìm thấy ứng viên với mã sinh viên đã cho!",
            });
        }
        await candidateRepository.changeStatus(candidate.id, status);
        return candidate;
    };
    public getCandidateStats = async () => {
        // 1. Định nghĩa phạm vi thời gian cho Ngày hôm nay
        const today = Helpers.getStartOfDay(new Date());
        const tomorrow = Helpers.getNextDay(new Date());

        // 2. Tính toán các chỉ số
        const record = await prisma.candidate.findMany();

        const receivedMailCount = await prisma.candidate.count({
            where: { isSendMail: true },
        });

        const candidatesCreatedToday = await prisma.candidate.count({
            where: {
                createdAt: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });
        const lastUpdatedCandidate = await prisma.candidate.findFirst({
            orderBy: {
                createdAt: "desc", // Sắp xếp giảm dần (mới nhất lên đầu)
            },
            select: {
                createdAt: true,
            },
        });

        let groupMajor = (
            await prisma.candidate.groupBy({
                by: ["major"],
                _count: {
                    major: true,
                },
            })
        ).map((item) => ({
            major: item.major,
            count: item._count.major,
        }));

        // tính theo khóa
        const object: { [key: string]: number } = {};
        record.forEach((item) => {
            const ch = item.studentCode.substring(2, 4);
            if (!object[ch]) object[ch] = 1;
            else object[ch]++;
        });

        return {
            totalCandidates: record.length,
            receivedMailCount,
            notReceivedMailCount: record.length - receivedMailCount,
            candidatesCreatedToday,
            lastUpdatedCandidate: lastUpdatedCandidate?.createdAt,
            groupMajor,
            stats: object,
            auto_send_mail: (await settingRepository.get("send_mail_auto"))?.value === "1",
        };
    };

    // public sendMail = async () => {

    //     const infoTemplate = await this.getTemplateSendEmail();
    //     const emails = await this.getInfoCandidates(infoTemplate as EmailTemplateType);

    //     const emailLocked = await this.attemptBatchLock(Object.keys(emails));

    //     const promises: Promise<void>[] = [];
    //     for (let email of emailLocked) {
    //         promises.push(
    //             emailService.sendMail(email, emails[email].data, {
    //                 subject: infoTemplate.subject!,
    //                 pathName: infoTemplate.pathName,
    //             }),
    //         );
    //     }
    //     const results = await Promise.allSettled(promises);

    //     const emailSendedSs: string[] = [],
    //         unlockPromises: Promise<any>[] = [];

    //     results.forEach((result, index) => {
    //         const email = emailLocked[index];
    //         const lockKey = `lock:${email}`;
    //         if (result.status === "fulfilled") {
    //             emailSendedSs.push(email);
    //             console.log("Đã gửi email thành công đến: ", email);
    //         } else {
    //             const reason = result.reason as any;
    //             console.error(`Gửi thất bại đến ${email}. Lỗi:`, reason?.message || reason);
    //         }
    //         unlockPromises.push(redisClient.del(lockKey));
    //     });
    //     await Promise.allSettled([...unlockPromises, candidateRepository.updateStatusSendMail(emailSendedSs)]);
    //     console.log("Đã xử lý hoàn tất!");
    // };

    // private getTemplateSendEmail = async () => {
    //     const infoTemplate = await emailTemplateRepository.getTemplateActive();
    //     if (!infoTemplate) {
    //         throw new ErrorWithStatus({
    //             status: HTTP_STATUS.NOT_FOUND,
    //             message: "Không tìm thấy template nào đang hoạt động"!,
    //         });
    //     }
    //     return infoTemplate;
    // };

    public sendMail = async (result: ResultType) => {
        const infoTemplate = await this.getTemplateSendEmail(result);
        const emails = await this.getInfoCandidates(infoTemplate as EmailTemplateType, null, result);
        // console.log("Object.keys(emails)", Object.keys(emails).length);
        // return;
        const emailLocked = await this.attemptBatchLock(Object.keys(emails));

        const promises: Promise<void>[] = [];
        for (let email of emailLocked) {
            promises.push(
                emailService.sendMail(email, emails[email].data, {
                    subject: infoTemplate.subject!,
                    pathName: infoTemplate.pathName,
                }),
            );
        }
        console.log("Đã chuẩn bị gửi maillll");
        const results = await Promise.allSettled(promises);

        const emailSendedSs: string[] = [],
            unlockPromises: Promise<any>[] = [];

        results.forEach((result, index) => {
            const email = emailLocked[index];
            const lockKey = `lock:${email}`;
            if (result.status === "fulfilled") {
                emailSendedSs.push(email);
                console.log("Đã gửi email thành công đến: ", email, " voi ket qua ", result);
            } else {
                const reason = result.reason as any;
                console.error(`Gửi thất bại đến ${email}. Lỗi:`, reason?.message || reason);
            }
            unlockPromises.push(redisClient.del(lockKey));
        });
        await Promise.allSettled([...unlockPromises, candidateRepository.updateStatusSendMail(emailSendedSs)]);
        console.log("Đã xử lý hoàn tất!");
    };

    // private getTemplateSendEmail = async () => {
    //     const infoTemplate = await emailTemplateRepository.getTemplate(RoundType.ROUND_1, ResultType.PASSED);
    //     if (!infoTemplate) {
    //         throw new ErrorWithStatus({
    //             status: HTTP_STATUS.NOT_FOUND,
    //             message: "Không tìm thấy template nào đang hoạt động"!,
    //         });
    //     }
    //     return infoTemplate;
    // };
    private getTemplateSendEmail = async (result: ResultType) => {
        // nhớ đổi lại template nữa nhé
        const infoTemplate = await emailTemplateRepository.getTemplate(RoundType.ROUND_2, result);
        if (!infoTemplate) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.NOT_FOUND,
                message: "Không tìm thấy template nào đang hoạt động"!,
            });
        }
        return infoTemplate;
    };

    public getInfoCandidates = async (
        infoTemplate: EmailTemplateType,
        infoPerson: InfoTestEmailType | null = null,
        result: ResultType,
    ) => {
        const emails = await (async function () {
            const emailAndInfo: { [key: string]: any } = {};
            const infoCandidate = infoPerson ? [infoPerson] : await candidateRepository.getAnyEmail(10, result);
            // console.log(infoCandidate);

            infoCandidate.map((item) => item.email);
            infoCandidate.forEach((candi) => {
                const regex = /\{\{(.*?)\}\}/;
                const info: Record<string, any> = {};
                const valuesObject = infoTemplate.values as Record<string, any>;
                info.email = candi.email;
                info.data = valuesObject.reduce((acc: Record<string, any>, currentItem: Record<string, any>) => {
                    const key = Object.keys(currentItem)[0].match(regex)?.[1] as string;

                    const valueOfKey = currentItem[`{{${key}}}`];
                    let value = valueOfKey;

                    if (valueOfKey === "@@fullName") {
                        value = candi.lastName + " " + candi.firstName;
                    } else if (valueOfKey === "@@email") {
                        value = candi.email;
                    } else if (valueOfKey === "@@phone") {
                        value = candi.phone;
                    }

                    return {
                        ...acc,
                        [key]: value,
                    };
                }, {});
                emailAndInfo[candi.email] = info;
            });
            return emailAndInfo;
        })();
        return emails;
    };

    private attemptBatchLock = async (emails: string[]) => {
        const lockPromises = emails.map((email) =>
            redisClient.set(`lock:${email}`, "1", "EX", 3600, "NX").then((result) => ({
                email,
                locked: result === "OK",
            })),
        );
        const lockResults = await Promise.all(lockPromises);
        const successfullyLockedEmails = lockResults.filter((r) => r.locked).map((r) => r.email);
        return successfullyLockedEmails;
    };

    private handleFileData = async (userId: string, filePath: string) => {
        const candidates: CandidateType[] = [];

        try {
            const fileContent = fs.readFileSync(filePath, "utf8");

            const rawSplit = fileContent.split("\n");
            for (let item of rawSplit) {
                const splitTab = item.split("\t");
                for (let i = 1; i <= 7; ++i) {
                    splitTab[i] = Helpers.filterRawInfo(splitTab[i].trim());
                }
                candidates.push(
                    new Candidate({
                        firstName: splitTab[1],
                        lastName: splitTab[2],
                        major: splitTab[3],
                        email: splitTab[4],
                        phone: splitTab[5],
                        semester: splitTab[6],
                        studentCode: splitTab[7],
                    }),
                );
            }
            await logRepository.writeLogs(userId, `Đã cập nhật dữ liệu mới nhất!`);
            return candidates;
        } catch (error) {
            throw new ErrorWithStatus({
                status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
                message: "Không thể đọc được dữ liệu từ file" + error,
            });
        }
    };
}
const candidateService = new CandidateService();
export default candidateService;
