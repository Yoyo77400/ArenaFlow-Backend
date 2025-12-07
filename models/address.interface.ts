import { ITimestamp } from './index';

export interface IAddress extends ITimestamp {
    _id: string;
    idKYC?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    longitude: number;
    latitude: number;
    addressLine1: string;
    addressLine2?: string;
}