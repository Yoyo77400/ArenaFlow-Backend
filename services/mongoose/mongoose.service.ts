import { Mongoose, connect } from "mongoose";
import { config } from "dotenv";
import { UserService, AddressService, KYCService, LegalsService } from "./index";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } } as const;

export class MongooseService {
  private static instance?: MongooseService;
  public mongoose: Mongoose;
  public userService : UserService;
  public addressService: AddressService;
  public kycService: KYCService;
  public legalService: LegalsService;

  private constructor(mongoose: Mongoose) {
    this.mongoose = mongoose;
    this.userService = new UserService(this);
    this.addressService = new AddressService(this);
    this.kycService = new KYCService(this);
    this.legalService = new LegalsService(this);
  }

  public static async getInstance(): Promise<MongooseService> {
    if (!MongooseService.instance) {
      const connection = await MongooseService.openConnection();
      MongooseService.instance = new MongooseService(connection);
    }
    return MongooseService.instance;
  }

  private static openConnection(): Promise<Mongoose> {
    const nodeEnv = process.env.NODE_ENV || "development";
    console.log("Node environment:", nodeEnv);
    if (nodeEnv === "production") {
      console.log("Production connection");
      const mongoUri = process.env.MONGODB_URI! as string;
      return connect(mongoUri, clientOptions);
    } else {
      console.log("Local connection");
      const mongoUser = process.env.MONGODB_USER! as string;
      const mongoPassword = process.env.MONGODB_PWD! as string;
      const mongoDatabase = process.env.MONGODB_DB! as string;
      return connect("mongodb://localhost:27017", {
        user: mongoUser, 
        pass: mongoPassword, 
        dbName: mongoDatabase
      });
    } 
  }
}
