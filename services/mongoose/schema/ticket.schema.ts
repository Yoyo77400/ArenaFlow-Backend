import { Schema } from 'mongoose';
import { ITicket, TicketStatus } from '../../../models';

export const TicketSchema = new Schema<ITicket>({
    _id: { type: String, required: true },
    eventId: { type: String, required: true },
    category: { type: String, required: true },
    userId: { type: String, required: true },
    seatNumber: { type: String, required: false },
    purchaseDate: { type: Date, required: true },
    price: { type: Number, required: true },
    qrCodeData: { type: String, required: true },
    image: { type: String, required: false },
    status: { type: String, enum: Object.values(TicketStatus), required: true },
    contractAddress: { type: String, required: false },
}, {
    timestamps: true,
    collection: 'tickets',
    versionKey: false
});