import { Model } from "mongoose";
import { MongooseService } from "./mongoose.service";
import { Models } from "./mongoose.models";
import { IEvent } from "../../models";
import { EventSchema } from "./schema/event.schema";

export type ICreateEvent = Omit<IEvent, "_id" | "createdAt" | "updatedAt">;
export class EventService {
    readonly mongooseService: MongooseService;
    readonly eventModel: Model<IEvent>;

    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.eventModel = mongooseService.mongoose.model(Models.Event, EventSchema);
    }
    async createEvent(eventData: ICreateEvent): Promise<IEvent> {
        const event = new this.eventModel(eventData);
        return event.save();
    }
    async getEventById(eventId: string): Promise<IEvent | null> {
        return this.eventModel.findById(eventId).exec();
    }
    async getAllEvents(): Promise<IEvent[]> {
        return this.eventModel.find().exec();
    }
    async updateEvent(eventId: string, updateData: Partial<ICreateEvent>): Promise<IEvent | null> {
        return this.eventModel.findByIdAndUpdate(eventId, updateData, { new: true }).exec();
    }
    async deleteEvent(eventId: string): Promise<IEvent | null> {
        return this.eventModel.findByIdAndDelete(eventId).exec();
    }
}