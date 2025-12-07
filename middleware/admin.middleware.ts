import express from 'express';
import { MongooseService } from '../services/mongoose/mongoose.service';
import { SecurityUtils } from '../utils/security.utils';

export default function adminMiddleware(): express.RequestHandler {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const token = req.headers['authorization'] as string;
        const userId = req.headers['user-id'] as string;
        const mongooseService = await MongooseService.getInstance();
        const userService = mongooseService.userService;
        if (!mongooseService) {
            res.status(500).json({ error: 'Mongoose service not initialized' });
            return;
        }
        console.log("token", token);
        console.log("userId", userId);
        if (!token) {
            res.status(401).json({ error: 'Unauthorized: Token is required' });
            return;
        }
        const user = await userService.getUserByDynamicUserId(userId);
        const encryptedSignature = SecurityUtils.verifyDynamicToken(token);

        if (!encryptedSignature) {
            res.status(401).json({ error: 'Unauthorized: Invalid token' });
            return;
        }

        if (!user) {
            res.status(401).json({ error: 'Unauthorized: Invalid token' });
            return;
        }
        if (!user.admin) {
            res.status(403).json({ error: 'Forbidden: User is not an admin' });
            return;
        }

        next();
    };
}