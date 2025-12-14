import express from 'express';
import cors from "cors";
import path from 'path';
import { config } from 'dotenv';
import { MongooseService } from './services/mongoose';
import { AuthController, EventController, TicketController } from './controllers/index';

config();

const allowedOrigins = [
  "http://localhost:5173", // Vite
];

function launchAPI() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(
  cors({
    origin: (origin, callback) => {
      // origin undefined = Postman / curl
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
  app.use(express.json());

  const uploadsDir = path.join(process.cwd(), "uploads");
  app.use("/uploads", express.static(uploadsDir, { maxAge: "7d", etag: true }));
  app.use('/auth', AuthController.getInstance().buildRouter());
  app.use('/events', EventController.getInstance().buildRouter());
  app.use('/tickets', TicketController.getInstance().buildRouter());


  app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Welcome to Arenaflow API');
  });

  app.listen(process.env.PORT, async () => {
    console.log(`Arenaflow is running on port ${port}`);
  });
}

async function setupAPI() {
    const mongooseService = await MongooseService.getInstance();
    const userService = mongooseService.userService;
    const rootUser = await userService.getRootUser();
    if (!rootUser) {
        if (!process.env.ROOT_PUBLIC_KEY) {
            throw new Error('ROOT_PUBLIC_KEY environment variable is not set');
        }
        const user = await userService.createUser({
            dynamicUserId: "123",
            firstName: 'Yohan',
            lastName: 'Georgelin',
            email: 'yohan.georgelin@gmail.com',
            publicKey: process.env.ROOT_PUBLIC_KEY!,
            admin: true,
            whitelist: true
        });
        console.log('Root user created:', user);
    } else {
        console.log('Root user already exists');
    }
}

async function main() {
  await setupAPI();
  launchAPI();
}

main().catch((error) => {
  console.error('Error starting Arenaflow API:', error);
  process.exit(1);
});