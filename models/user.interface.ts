import { ITimestamp } from './index';
import { Types } from 'mongoose';

export interface IUser extends ITimestamp {
    _id: string;
    dynamicUserId: string;
    KYCId?: string;
    addressId?: string;
    publicKey: string;
    firstName: string;
    lastName: string;
    email: string;
    admin: boolean;
    whitelist: boolean;
}