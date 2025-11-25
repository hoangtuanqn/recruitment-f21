import logRepository from "~/repositories/log.repository";

class LogService {
    public getAll = async () => {
        return await logRepository.getAll();
    };
}
const logService = new LogService();
export default logService;
