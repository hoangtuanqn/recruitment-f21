import cron from "node-cron";
import { ResultType } from "~/constants/enums";
import settingRepository from "~/repositories/setting.repository";
import candidateService from "~/services/candidate.service";
cron.schedule("*/1 * * * *", async () => {
    try {
        if ((await settingRepository.get("send_mail_auto"))?.value === "1") {
            // console.log("lọt vô nè");
            await Promise.allSettled([
                candidateService.sendMail(ResultType.PASSED),
                candidateService.sendMail(ResultType.FAILED),
            ]);
            // await candidateService.sendMail(ResultType.PASSED);
        } else {
            console.log("Chưa kích hoạt tính năng send email!");
        }
        console.log("Đã chạy vào lúc ", new Date().toLocaleTimeString());
    } catch (error) {
        console.error("Lỗi khi gửi email:", error);
    }
});
