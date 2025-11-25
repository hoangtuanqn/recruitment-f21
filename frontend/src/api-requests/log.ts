import publicApi from "~/lib/axios-instance";
import type { GetAllLogType } from "~/types/log.types";

class Log {
    static getAll = () => publicApi.get<GetAllLogType>("/logs/get-all");
}
export default Log;
