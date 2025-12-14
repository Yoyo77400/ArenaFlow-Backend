import express from "express";
import { MongooseService } from "../services/mongoose";
import { SecurityUtils } from "../utils/security.utils";
export class AuthController {
    private static instance?: AuthController;

    static getInstance(): AuthController {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }
    
    async login(req: express.Request, res: express.Response): Promise<void> {
        const { publicKey, userId } = req.body;
        const token = req.headers['authorization'] as string;

        console.log(token, publicKey, userId);

        if (!publicKey || !token || !userId) {
            res.status(400).end();
            return
        }

        try {
            const mongooseService = await MongooseService.getInstance();
            const userService = mongooseService.userService;

            const {userId: userIdFromToken, isValid} = await SecurityUtils.verifyDynamicToken(token);
            if (!userIdFromToken || !isValid) {
                res.status(401).end();
                return;
            }

            const user = await userService.getUserByDynamicUserId(userIdFromToken);
            console.log("user", user);

            if (!user) {
                res.status(401).end();
                return;
            }

            res.json({
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    admin: user.admin,
                    whitelist: user.whitelist,
                },
            });
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).end();
        }
    }
    async register(req: express.Request, res: express.Response): Promise<void> {
        const { publicKey, user } = req.body;
        const token = req.headers['authorization'] as string;
        
        if (!user || !publicKey || !token) {
            res.status(400).json({ error: "All fields are required" });
            return ;
        }

        const { firstName, lastName, email } = user;
        const dynamicUserId = user.userId;

        try {
            const mongooseService = await MongooseService.getInstance();
            const userService = mongooseService.userService;
            const isUserExist = await userService.getUserByDynamicUserId(dynamicUserId);
            if (isUserExist) {
                res.status(400).json({ error: "User already exists" });
                return;
            }

            const newUser = await userService.createUser(
                {
                    dynamicUserId,
                    firstName,
                    lastName,
                    email,
                    publicKey,
                    admin: false,
                    whitelist: false,
                }
            );
            res.status(201).json(newUser);
        } catch (error) {
            console.error("Error during registration:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async verifyAdmin(req: express.Request, res: express.Response): Promise<void> {
        
        console.log("verifyAdmin");
        const token = req.headers['authorization'] as string;

        console.log("token verifyAdmin", token);
        
        if (!token) {
            res.status(401).json({ error: "Authorization token required" });
            return;
        }

        try {
            // Vérifier le token JWT
            const {isValid, userId} = await SecurityUtils.verifyDynamicToken(token);
            console.log("isValid:", isValid, "userId:", userId);
            if (!isValid) {
                res.status(401).json({ error: "Invalid token" });
                return;
            }

            if (!userId) {
                res.status(401).json({ error: "Invalid token payload" });
                return;
            }

            // Vérifier si l'utilisateur existe et est admin
            const mongooseService = await MongooseService.getInstance();
            const userService = mongooseService.userService;
            const user = await userService.getUserByDynamicUserId(userId);
            console.log("user", user);

            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            if (!user.admin) {
                res.status(403).json({ error: "Admin privileges required" });
                return;
            }

            // Utilisateur admin vérifié
            res.status(200).json({
                success: true,
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    admin: user.admin,
                    whitelist: user.whitelist,
                }
            });

        } catch (error) {
            console.error("Error during admin verification:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.post("/login", express.json(), this.login.bind(this));
        router.post("/register",express.json(), this.register.bind(this));
        router.post("/verify-admin", express.json(), this.verifyAdmin.bind(this));
        return router;
    }
}