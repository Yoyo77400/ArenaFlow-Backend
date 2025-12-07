import { Schema } from 'mongoose';
import { IAddress } from '../../../models';

export const AddressSchema = new Schema<IAddress>({
  idKYC: { type: Schema.Types.ObjectId, ref: 'KYC',required: false },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, required: false },
  city: { type: String, required: true },
  state: { type: String, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
}, {
    timestamps: true,
    collection: 'addresses',
    versionKey: false
});