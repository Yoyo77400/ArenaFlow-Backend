import { Schema } from 'mongoose';
import { IKYC, KYCStatus } from '../../../models';

export const KYCSchema = new Schema<IKYC>({
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    addressId: { type: String, required: true },
    status: { type: String, enum: Object.values(KYCStatus), default: KYCStatus.PENDING, required: true}
}, {
    timestamps: true,
    collection: 'kyc',
    versionKey: false
});