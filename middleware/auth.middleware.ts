import express from 'express';
import { MongooseService } from '../services/mongoose/mongoose.service';
import { SecurityUtils } from '../utils/security.utils';

export default function authMiddleware(): express.RequestHandler { 
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const token = req.headers['Authorization'] as string;
        const dynamicUserId = req.headers['dynamic-user-id'] as string;
        const mongooseService = await MongooseService.getInstance();
        const userService = mongooseService.userService;
        
        if (!mongooseService) {
            res.status(500).json({ error: 'Mongoose service not initialized' });
            return;
        }
        
        if (!token || !dynamicUserId) {
            res.status(401).json({ error: 'Unauthorized: Token and Dynamic User ID are required' });
            return;
        }
        
        const user = await userService.getUserByDynamicUserId(dynamicUserId);
        if (!user) {
            res.status(401).json({ error: 'Unauthorized: Invalid user ID' });
            return;
        }
        
        const isValidToken = await SecurityUtils.verifyDynamicToken(token);
        if (!isValidToken) {
            res.status(401).json({ error: 'Unauthorized: Invalid token' });
            return;
        }
        res.status(200).json({
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                admin: user.admin,
                whitelist: user.whitelist,
            },
        });
        next();
    };
}