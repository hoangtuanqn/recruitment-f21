import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import "~/configs/env";
import Handlebars from "handlebars";
class EmailService {
    private TEMPLATE_DIR;
    private transporter: nodemailer.Transporter;
    constructor() {
        this.TEMPLATE_DIR = path.join(process.cwd(), "uploads", "templates");
        this.transporter = nodemailer.createTransport({
            service: "gmail",

            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }

    public sendMail = async (
        toEmail: string,
        data: { [key: string]: string | number },
        infoTempl: { subject: string },
    ) => {
        try {
            const info = await this.transporter.sendMail({
                from: "DEMO F-CODE",
                to: toEmail,
                subject: infoTempl.subject!,
                html: await this.readRecruitmentTemplate(data),
            });
            // console.log(info);
        } catch (err: any) {
            // console.error("Lỗi khi gửi mail:", err?.response || err?.message || err);
            throw err;
        }
    };

    private readRecruitmentTemplate = async (data: { [key: string]: string | number }) => {
        // 1. Xây dựng đường dẫn tuyệt đối
        const templatePath = path.join(this.TEMPLATE_DIR, "recruitment.html");

        try {
            // 2. Đọc nội dung tệp
            const source = await fs.readFile(templatePath, "utf8");

            // 3. Biên dịch và chèn dữ liệu bằng Handlebars
            const template = Handlebars.compile(source);
            const htmlContent = template(data);

            return htmlContent;
        } catch (error) {
            console.error("Lỗi khi đọc hoặc biên dịch template:", error);
            throw new Error("Không tìm thấy hoặc không đọc được tệp template.");
        }
    };
}
const emailService = new EmailService();
export default emailService;
