import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads",
  filename(req, file, callback) {
    const ext = path.extname(file.originalname);

    const basename = path.basename(file.originalname, ext);

    const filename = `${basename}-${Date.now()}${ext}`;

    callback(null, filename);
  },
});

const upload = multer({ storage: storage });

export default upload;
