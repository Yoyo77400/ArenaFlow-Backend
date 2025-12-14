import express from 'express';
const cors = require('cors');
import { config } from 'dotenv';
import { MongooseService } from './services/mongoose';
import { AuthController, EventController, TicketController } from './controllers/index';

config();

function launchAPI() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

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