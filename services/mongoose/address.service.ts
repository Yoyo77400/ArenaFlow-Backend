import { IAddress } from "../../models";
import { AddressSchema } from "./schema/address.schema";
import { Model } from "mongoose";
import { MongooseService } from "./mongoose.service";
import { Models } from "./mongoose.models";

export type ICreateAddress = Omit<IAddress, "_id" | "createdAt" | "updatedAt">;
export class AddressService {
    readonly mongooseService: MongooseService;
    readonly addressModel: Model<IAddress>;
    
    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.addressModel = mongooseService.mongoose.model(Models.Address, AddressSchema);
    }
    
    static create(mongooseService: MongooseService): AddressService {
        return new AddressService(mongooseService);
    }
    
    async createAddress(address: ICreateAddress): Promise<IAddress> {
        return this.addressModel.create(address);
    }

    async getAddressById(id: string): Promise<IAddress | null> {
        return this.addressModel.findById(id).exec();
    }
}