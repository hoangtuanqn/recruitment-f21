import multer from "multer";
import path from "path";

const upload = (dir: string = "") => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `./uploads${dir}`);
        },
        filename: (req, file, cb) => {
            const fileExtension = path.extname(file.originalname);
            cb(null, `${Date.now()}_${fileExtension}`);
        },
    });
    const upload = multer({
        storage,
    });
    return upload;
};

export default upload;
