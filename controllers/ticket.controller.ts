import express from "express";
import { MongooseService } from "../services/mongoose";
import requireAuth from "../middleware/auth.middleware";

export class TicketController {
    private static instance?: TicketController;
    static getInstance(): TicketController {
        if (!TicketController.instance) {
            TicketController.instance = new TicketController();
        }
        return TicketController.instance;
    }

    async createTicket(req: express.Request, res: express.Response): Promise<void> {
        const ticketData = req.body;
        try {
            const mongooseService = await MongooseService.getInstance();
            const ticketService = mongooseService.ticketService;
            const newTicket = await ticketService.createTicket(ticketData);
            res.status(201).json(newTicket);
        } catch (error) {
            console.error("Error creating ticket:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getMyTickets(req: express.Request, res: express.Response): Promise<void> {
        const userId = req.params.userId;
        try {
            const mongooseService = await MongooseService.getInstance();
            const ticketService = mongooseService.ticketService;
            const tickets = await ticketService.getAllUserTickets(userId);
            res.status(200).json(tickets);
        } catch (error) {
            console.error("Error fetching tickets:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.post('/create', requireAuth(), express.json(), this.createTicket.bind(this));
        router.get('/user/:userId', requireAuth(), this.getMyTickets.bind(this));
        return router;
    }
}