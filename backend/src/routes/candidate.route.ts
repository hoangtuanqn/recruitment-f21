import { validate } from "~/utils/validation";
import { Request, Response, Router } from "express";
import multer from "multer";
import * as candidateController from "~/controllers/candidates.controllers";
import { confirmSendMailSchema, getAllCandidateQuerySchema } from "~/models/rules/candidate.schema";
import { auth, isRole } from "~/middlewares/auth.middlewares";

import candidateService from "~/services/candidate.service";
import { ResultType } from "~/constants/enums";

const candidateRouter = Router();
const upload = multer({ dest: "uploads/" });
// định nghĩa routing
candidateRouter.get("/stats", auth, candidateController.stats);
candidateRouter.get("/get-all", auth, validate(getAllCandidateQuerySchema), candidateController.getAll);
candidateRouter.post(
    "/confirm-send-mail",
    auth,
    isRole(["ADMIN", "EDITOR"]),
    validate(confirmSendMailSchema),
    candidateController.confirmSendMail,
);
candidateRouter.post(
    "/change-status",
    auth,
    isRole(["ADMIN", "EDITOR"]),
    // validate(confirmSendMailSchema),
    candidateController.changeStatusScore,
);
candidateRouter.post("/create", auth, isRole(["ADMIN"]), upload.single("file"), candidateController.create);
candidateRouter.get("/export-excel", auth, isRole(["ADMIN", "EDITOR"]), candidateController.exportExcel);
// candidateRouter.get("/send-email", candidateController.sendMail);
candidateRouter.get("/test", async (req: Request, res: Response) => {
    await candidateService.sendMail(ResultType.FAILED);
    return res.json({ message: "Hello World!" });
});

// const list = [
//     {
//         email: "chaukha017@gmail.com",
//         pdf: "55",
//     },
//     {
//         email: "nhanhoangtrong10a222@gmail.com",
//         pdf: "206",
//     },
//     {
//         email: "phuvnt01122006@gmail.com",
//         pdf: "346",
//     },
//     {
//         email: "nguyenvotiendat88@gmail.com",
//         pdf: "274",
//     },
//     {
//         email: "huynhgiabao2718@gmail.com",
//         pdf: "38",
//     },
//     {
//         email: "ngvphu235e@gmail.com",
//         pdf: "40",
//     },
//     {
//         email: "taanhduc15126@gmail.com",
//         pdf: "341",
//     },
//     {
//         email: "bao1342007@gmail.com",
//         pdf: "358",
//     },
//     {
//         email: "lekhahoang5@gmail.com",
//         pdf: "166",
//     },
//     {
//         email: "lekhahuy9@gmail.com",
//         pdf: "167",
//     },
//     {
//         email: "holethienan30102006@gmail.com",
//         pdf: "72",
//     },
//     {
//         email: "kietluuhoanganh@gmail.com",
//         pdf: "288",
//     },
//     {
//         email: "voquocthang040407@gmail.com",
//         pdf: "360",
//     },
//     {
//         email: "vohius.06@gmail.com",
//         pdf: "259",
//     },
//     {
//         email: "quannmdt@gmail.com",
//         pdf: "173",
//     },
//     {
//         email: "phamhungsang24052007@gmail.com",
//         pdf: "179",
//     },
//     {
//         email: "nguyenhunghien2928@gmail.com",
//         pdf: "56",
//     },
//     {
//         email: "tranngocxuanphuc307@gmail.com",
//         pdf: "103",
//     },
//     {
//         email: "doananhtran242007@gmail.com",
//         pdf: "153",
//     },
//     {
//         email: "tu5249949@gmail.com",
//         pdf: "92",
//     },
//     {
//         email: "minkabell987@gmail.com",
//         pdf: "361",
//     },
//     {
//         email: "pquan2212@gmail.com",
//         pdf: "317",
//     },
//     {
//         email: "tgia2894@gmail.com",
//         pdf: "57",
//     },
//     {
//         email: "khaithichnhon@gmail.com",
//         pdf: "387",
//     },
//     {
//         email: "xuankhoinguyen177@gmail.com",
//         pdf: "250",
//     },
//     {
//         email: "tranquanlxag1990@gmail.com",
//         pdf: "79",
//     },
//     {
//         email: "vangiabao105@gmail.com",
//         pdf: "171",
//     },
//     {
//         email: "100catcatcat100@gmail.com",
//         pdf: "35",
//     },
//     {
//         email: "karovn.tv@gmail.com",
//         pdf: "110",
//     },
//     {
//         email: "datnguyencaotien@gmail.com",
//         pdf: "160",
//     },
//     {
//         email: "lamhoangan612@gmail.com",
//         pdf: "36",
//     },
//     {
//         email: "phankimphuong100102@gmail.com",
//         pdf: "155",
//     },
//     {
//         email: "trinhthiminhtam8122@gmail.com",
//         pdf: "332",
//     },
//     {
//         email: "checuongminhquoc@gmail.com",
//         pdf: "108",
//     },
//     {
//         email: "hophuca14@gmail.com",
//         pdf: "298",
//     },
//     {
//         email: "thanhtuan21062000@gmail.com",
//         pdf: "378",
//     },
//     {
//         email: "minhnhat071612@gmail.com",
//         pdf: "116",
//     },
//     {
//         email: "therealquangminh@gmail.com",
//         pdf: "130",
//     },
//     {
//         email: "luzmiuforerver@gmail.com",
//         pdf: "101",
//     },
//     {
//         email: "dthienphu160@gmail.com",
//         pdf: "300",
//     },
//     {
//         email: "phuchcm2006@gmail.com",
//         pdf: "137",
//     },
//     {
//         email: "xuantruong642004@gmail.com",
//         pdf: "90",
//     },
//     {
//         email: "tranminhkhanh793@gmail.com",
//         pdf: "154",
//     },
//     {
//         email: "viet2007ht@gmail.com",
//         pdf: "252",
//     },
//     {
//         email: "ledangminh1206@gmail.com",
//         pdf: "70",
//     },
//     {
//         email: "xuanhieubato@gmail.com",
//         pdf: "310",
//     },
//     {
//         email: "dattrank7217@gmail.com",
//         pdf: "61",
//     },
//     {
//         email: "lethiminhtam072006@gmail.com",
//         pdf: "221",
//     },
//     {
//         email: "damletuananh123@gmail.com",
//         pdf: "286",
//     },
//     {
//         email: "hoangnamvopham786@gmail.com",
//         pdf: "255",
//     },
//     {
//         email: "nguyenheo11032005@gmail.com",
//         pdf: "66",
//     },
//     {
//         email: "trungtin1218@gmail.com",
//         pdf: "212",
//     },
//     {
//         email: "tuongvan2639@gmail.com",
//         pdf: "120",
//     },
//     {
//         email: "tttbeo.007@gmail.com",
//         pdf: "189",
//     },
//     {
//         email: "anhpt.l.1922@gmail.com",
//         pdf: "46",
//     },
//     {
//         email: "vuminhtuan5264@gmail.com",
//         pdf: "271",
//     },
//     {
//         email: "hanngo416@gmail.com",
//         pdf: "185",
//     },
//     {
//         email: "thanhtung22012006@gmail.com",
//         pdf: "323",
//     },
//     {
//         email: "tranvuhaiduy2006hg@gmail.com",
//         pdf: "162",
//     },
//     {
//         email: "minhcuongchu1907@gmail.com",
//         pdf: "95",
//     },
//     {
//         email: "nguyenvangiabinh22072006@gmail.com",
//         pdf: "117",
//     },
//     {
//         email: "khanhtuong2302@gmail.com",
//         pdf: "80",
//     },
//     {
//         email: "myvy0807@gmail.com",
//         pdf: "41",
//     },
//     {
//         email: "buiphamchinhan@gmail.com",
//         pdf: "195",
//     },
//     {
//         email: "nguyenvanbinh542007@gmail.com",
//         pdf: "93",
//     },
//     {
//         email: "loiquoclepham@gmail.com",
//         pdf: "262",
//     },
//     {
//         email: "nguyentiendat7505@gmail.com",
//         pdf: "31",
//     },
//     {
//         email: "khoinguyenperfect@gmail.com",
//         pdf: "161",
//     },
//     {
//         email: "khoinguyenle07@gmail.com",
//         pdf: "53",
//     },
//     {
//         email: "quynhmeid207@gmail.com",
//         pdf: "74",
//     },
//     {
//         email: "vumaianhdat07@gmail.com",
//         pdf: "226",
//     },
//     {
//         email: "nguyen13032007@gmail.com",
//         pdf: "152",
//     },
//     {
//         email: "mercedecpeek502@gmail.com",
//         pdf: "32",
//     },
//     {
//         email: "htrong606@gmail.com",
//         pdf: "191",
//     },
//     {
//         email: "ngoctanphan064@gmail.com",
//         pdf: "165",
//     },
//     {
//         email: "votranngochuu@gmail.com",
//         pdf: "69",
//     },
//     {
//         email: "donghao2209@gmail.com",
//         pdf: "140",
//     },
//     {
//         email: "vandatt33027@gmail.com",
//         pdf: "270",
//     },
//     {
//         email: "ishisi.ainari@gmail.com",
//         pdf: "51",
//     },
//     {
//         email: "minhdang200718@gmail.com",
//         pdf: "45",
//     },
//     {
//         email: "xuannhi.nguyenpham@gmail.com",
//         pdf: "139",
//     },
//     {
//         email: "diechahien@gmail.com",
//         pdf: "273",
//     },
//     {
//         email: "thaihuyxbox@gmail.com",
//         pdf: "183",
//     },
//     {
//         email: "quocbao.nguyen16102006@gmail.com",
//         pdf: "123",
//     },
//     {
//         email: "dothanhbinh102007@gmail.com",
//         pdf: "65",
//     },
//     {
//         email: "phankhang16092006@gmail.com",
//         pdf: "170",
//     },
//     {
//         email: "phucgialy2007@gmail.com",
//         pdf: "144",
//     },
//     {
//         email: "dauducthanh240907@gmail.com",
//         pdf: "50",
//     },
//     {
//         email: "khangnguyen123cvn@gmail.com",
//         pdf: "67",
//     },
//     {
//         email: "giabao240806@gmail.com",
//         pdf: "73",
//     },
//     {
//         email: "nguyenthanhtrieta@gmail.com",
//         pdf: "30",
//     },
//     {
//         email: "buiphuoctrong.semi@gmail.com",
//         pdf: "83",
//     },
//     {
//         email: "nhannguyen120216@gmail.com",
//         pdf: "84",
//     },
//     {
//         email: "kietdlv@gmail.com",
//         pdf: "68",
//     },
//     {
//         email: "trancaothanhbtm9@gmail.com",
//         pdf: "58",
//     },
//     {
//         email: "vohuy19042007@gmail.com",
//         pdf: "121",
//     },
//     {
//         email: "lethihannc@gmail.com",
//         pdf: "241",
//     },
//     {
//         email: "hloitran2007@gmail.com",
//         pdf: "370",
//     },
//     {
//         email: "jhwei521@gmail.com",
//         pdf: "81",
//     },
//     {
//         email: "quang221208642@gmail.com",
//         pdf: "289",
//     },
//     {
//         email: "nguyencongtam11042007@gmail.com",
//         pdf: "131",
//     },
//     {
//         email: "chanhle1907@gmail.com",
//         pdf: "52",
//     },
//     {
//         email: "thietthachdo@gmail.com",
//         pdf: "231",
//     },
// ];
// candidateRouter.get("/demo", async (req: Request, res: Response) => {
//     for (let i = 0; i < list.length; i++) {
//         const item = list[i];
//         const can = await prisma.candidate.findUnique({
//             where: { email: item.email },
//         });
//         if (can) {
//             list[i].studentCode = can.studentCode;
//         } else {
//             console.log("khong tim thay email: " + item.email);
//         }
//     }
//     return res.json(list);
// });
export default candidateRouter;
