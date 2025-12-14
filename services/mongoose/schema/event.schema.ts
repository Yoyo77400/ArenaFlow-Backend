import { Schema } from 'mongoose';
import { IEvent, EventStatus } from '../../../models/event.interface';

export const EventSchema = new Schema<IEvent>({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: Object.values(EventStatus), required: true },
    capacity: { type: Number, required: true },
    attendeesCount: { type: Number, required: true, default: 0 },
    organizerId: { type: [String], required: true },
    contractAddress: { type: String, required: false },
}, {
    timestamps: true,
    collection: 'events',
    versionKey: false
});