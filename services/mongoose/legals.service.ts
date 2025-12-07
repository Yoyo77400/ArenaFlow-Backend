import { ILegal } from "../../models";
import { LegalSchema } from "./schema/legals.schema";
import { Model } from "mongoose";
import { MongooseService } from "./mongoose.service";
import { Models } from "./mongoose.models";

export type ICreateLegal = Omit<ILegal, "_id" | "createdAt" | "updatedAt">;
export class LegalsService {
    readonly mongooseService: MongooseService;
    readonly legalModel: Model<ILegal>;

    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.legalModel = mongooseService.mongoose.model(Models.Legals, LegalSchema);
    }

    static create(mongooseService: MongooseService): LegalsService {
        return new LegalsService(mongooseService);
    }

    async createLegal(legal: ICreateLegal): Promise<ILegal> {
        return this.legalModel.create(legal);
    }
}