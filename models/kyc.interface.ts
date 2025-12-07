import { ITimestamp } from "./index";

export enum KYCStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface IKYC extends ITimestamp {
    _id: string;
    userId: string;
    addressId: string;
    status: KYCStatus;
}
