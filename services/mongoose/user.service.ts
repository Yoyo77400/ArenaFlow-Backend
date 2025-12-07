import { IUser } from "../../models";
import { UserSchema } from "./schema/user.schema";
import { Model } from "mongoose";
import { MongooseService } from "./mongoose.service";
import { Models } from "./mongoose.models";

export type ICreateUser = Omit<IUser, "createdAt" | "updatedAt" | "_id">;

export class UserService {
    readonly mongooseService: MongooseService;
    readonly userModel: Model<IUser>;

  constructor(mongooseService: MongooseService) {
    this.mongooseService = mongooseService;
    this.userModel = mongooseService.mongoose.model(Models.User, UserSchema);
  }

  async createUser(user: ICreateUser): Promise<IUser> {
    const newUser = await this.userModel.create(user);
    return newUser;
  }

  async getRootUser(): Promise<IUser | null> {
    const rootPublicKey = process.env.ROOT_PUBLIC_KEY;
    if (!rootPublicKey) {
      throw new Error("ROOT_PUBLIC_KEY environment variable is not set");
    }
    return this.userModel.findOne({ publicKey: rootPublicKey }).exec();
  }

  async getUserByDynamicUserId(dynamicUserId: string): Promise<IUser | null> {
    console.log("dynamicUserId", dynamicUserId);
    return this.userModel.findOne({ dynamicUserId }).exec();
  }

}
