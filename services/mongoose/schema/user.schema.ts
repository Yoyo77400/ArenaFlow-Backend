import { Schema } from 'mongoose';
import { IUser } from '../../../models';

export const UserSchema = new Schema<IUser>({
  dynamicUserId: { type: String, required: true },
  KYCId: { type: Schema.Types.ObjectId, ref: 'KYC', required: false },
  addressId: { type: Schema.Types.ObjectId, ref: 'Address', required: false },
  publicKey: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  admin: { type: Boolean, default: false },
  whitelist: { type: Boolean, default: false }
}, {
    timestamps: true,
    collection: 'users',
    versionKey: false
});


