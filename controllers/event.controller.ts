import express from "express";
import { MongooseService } from "../services/mongoose";
import requireAuth from "../middleware/auth.middleware";

export class EventController {
    private static instance?: EventController;
    static getInstance(): EventController {
        if (!EventController.instance) {
            EventController.instance = new EventController();
        }
        return EventController.instance;
    }

    async createEvent(req: express.Request, res: express.Response): Promise<void> {
        const eventData = req.body;
        try {
            const mongooseService = await MongooseService.getInstance();
            const eventService = mongooseService.eventService;
            const newEvent = await eventService.createEvent(eventData);
            res.status(201).json(newEvent);
        } catch (error) {
            console.error("Error creating event:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getAllEvents(req: express.Request, res: express.Response): Promise<void> {
        try {
            const mongooseService = await MongooseService.getInstance();
            const eventService = mongooseService.eventService;
            const events = await eventService.getAllEvents();
            res.status(200).json(events);
        } catch (error) {
            console.error("Error fetching events:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getEventById(req: express.Request, res: express.Response): Promise<void> {
        const eventId = req.params.id;
        try {
            const mongooseService = await MongooseService.getInstance();
            const eventService = mongooseService.eventService;
            const event = await eventService.getEventById(eventId);
            if (!event) {
                res.status(404).json({ error: "Event not found" });
                return;
            }
            res.status(200).json(event);
        } catch (error) {
            console.error("Error fetching event:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    /*async getMetaDataForEventContract(eventContractAddress: string): Promise<any> {
        try {
            const mongooseService = await MongooseService.getInstance();
            const eventService = mongooseService.eventService;
            const metadata = await eventService.getMetaDataForEventContract(eventContractAddress);
            return metadata;
        } catch (error) {
            console.error("Error fetching event metadata:", error);
            throw error;
        }
    }*/

    buildRouter(): express.Router {
        const router = express.Router();
        router.post('/create',requireAuth(), express.json(), this.createEvent.bind(this));
        router.get('/', this.getAllEvents.bind(this));
        router.get('/:id', this.getEventById.bind(this));
        return router;
    }
}