import { IKYC, KYCStatus } from "../../models";
import { KYCSchema } from "./schema/kyc.schema";
import { Model } from "mongoose";
import { MongooseService } from "./mongoose.service";
import { Models } from "./mongoose.models";

export type ICreateKYC = Omit<IKYC, "_id" | "createdAt" | "updatedAt">;
export class KYCService {
    readonly mongooseService: MongooseService;
    readonly kycModel: Model<IKYC>;

    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.kycModel = mongooseService.mongoose.model(Models.KYC, KYCSchema);
    }

    static create(mongooseService: MongooseService): KYCService {
        return new KYCService(mongooseService);
    }

    async createKYC(kyc: ICreateKYC): Promise<IKYC> {
        return this.kycModel.create(kyc);
    }
}