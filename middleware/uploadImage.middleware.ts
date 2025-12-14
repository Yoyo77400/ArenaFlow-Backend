import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function extFromMime(mime: string) {
  if (mime === "image/png") return "png";
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "bin";
}

export const uploadEventCover = multer({
  storage: multer.diskStorage({
    destination: (req, _file, cb) => {
      // Option : ranger par userId si ton auth middleware pose req.user
      const userId = (req as any).user?.id ?? "anonymous";
      const dir = path.join(process.cwd(), "uploads", "events", userId, "covers");
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const ext = extFromMime(file.mimetype);
      const id = crypto.randomBytes(12).toString("hex");
      cb(null, `${Date.now()}-${id}.${ext}`);
    },
  }),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) return cb(new Error("INVALID_IMAGE_TYPE"));
    cb(null, true);
  },
}).single("file");
