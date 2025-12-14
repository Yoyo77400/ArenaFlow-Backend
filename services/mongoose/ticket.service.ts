import { Model } from "mongoose";
import { MongooseService } from "./mongoose.service";
import { Models } from "./mongoose.models";
import { ITicket } from "../../models";
import { TicketSchema } from "./schema/ticket.schema";

export type ICreateTicket = Omit<ITicket, "_id" | "createdAt" | "updatedAt">;
export class TicketService {
    readonly mongooseService: MongooseService;
    readonly ticketModel: Model<ITicket>;
    
    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.ticketModel = mongooseService.mongoose.model(Models.Ticket, TicketSchema);
    }
    
    async createTicket(ticketData: ICreateTicket): Promise<ITicket> {
        const ticket = new this.ticketModel(ticketData);
        return ticket.save();
    }

    async getAllUserTickets(userId: string): Promise<ITicket[]> {
        return this.ticketModel.find({ userId: userId }).exec();
    }
}

