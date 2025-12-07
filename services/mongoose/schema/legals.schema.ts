import { Schema } from 'mongoose';
import { ILegal } from '../../../models';

export const LegalSchema = new Schema<ILegal>({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    version: { type: String, required: true }
}, {
    timestamps: true,
    collection: 'legals',
    versionKey: false
});
