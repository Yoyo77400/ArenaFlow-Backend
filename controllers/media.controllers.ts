import express from "express";
import path from "path";
import { uploadEventCover } from "../middleware/uploadImage.middleware";
import requireAuth from "../middleware/auth.middleware";

export class MediaController {
    private static instance?: MediaController;
    static getInstance(): MediaController {
        if (!MediaController.instance) {
            MediaController.instance = new MediaController();
        }
        return MediaController.instance;
    }
    async uploadEventCoverImage(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        uploadEventCover(req, res, (err: any) => {
            if (err) {
                const msg = String(err?.message ?? err);
                if (msg === "INVALID_IMAGE_TYPE") {
                    res.status(400).json({ error: "Invalid image type" });
                    return;
                }
                if (err?.code === "LIMIT_FILE_SIZE") {
                    res.status(413).json({ error: "File too large" });
                    return;
                }
                console.error("Error uploading image:", err);
                res.status(400).json({ error: "Image upload failed" });
                return;
            }

            const file = (req as any).file as Express.Multer.File | undefined;
            if (!file) {
                res.status(400).json({ error: "No file uploaded" });
                return;
            }

            const userId = (req as any).user?.id ?? "anonymous";

            // Chemin relatif (à stocker en DB)
            const relativePath = path
                .relative(path.join(process.cwd(), "uploads"), file.path)
                .split(path.sep)
                .join("/");

            // URL publique (pour le front)
            const fileUrl = `/uploads/${relativePath}`;

            res.status(201).json({
                path: relativePath, // portable (DB)
                url: fileUrl,       // consommable front
                filename: file.filename,
                mime: file.mimetype,
                size: file.size,
                owner: userId,
            });
        });
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.post(
            '/events/covers',
            requireAuth(),
            this.uploadEventCoverImage.bind(this)
        );
        return router;
    }
}