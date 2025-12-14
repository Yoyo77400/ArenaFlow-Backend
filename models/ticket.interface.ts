import { ITimestamp } from "./timestamp.interface";

export enum TicketStatus {
    ACTIVE = "ACTIVE",
    VALIDATED = "VALIDATED",
    CANCELLED = "CANCELLED"
}

export interface ITicket extends ITimestamp {
    _id: string;
    eventId: string;
    category: string;
    userId: string;
    seatNumber?: string;
    purchaseDate: Date;
    price: number;
    qrCodeData: string;
    image?: string;
    status: TicketStatus;
    contractAddress?: string;
}
