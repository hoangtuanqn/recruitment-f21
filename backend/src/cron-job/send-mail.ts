import cron from "node-cron";
import settingRepository from "~/repositories/setting.repository";
import candidateService from "~/services/candidate.service";
cron.schedule("*/1 * * * *", async () => {
  if ((await settingRepository.get("send_mail_auto"))?.value === "1") {
    await candidateService.sendMail();
  } else {
    console.log("Chưa kích hoạt tính năng send email!");
  }
  console.log("Đã chạy vào lúc ", new Date().toLocaleTimeString());
});
