import { ITimestamp } from "./timestamp.interface";

export enum EventStatus {
    SCHEDULED = "SCHEDULED",
    ONGOING = "ONGOING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

export interface IEvent extends ITimestamp {
    _id: string;
    eventId: string;
    name: string;
    date: Date;
    location: string;
    description?: string;
    organizerId: string[];
    status: EventStatus;
    capacity: number;
    attendeesCount: number;
    contractAddress?: string;
}