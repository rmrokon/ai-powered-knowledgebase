import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Routes from './modules';
import { IUser } from './modules/users/types';
import { globalErrorHandler, handleUncaughtExceptions, handleUnhandledRejections, notFoundHandler } from './middlewares/errorHandlers';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => res.send('API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.use('/v1', Routes());


declare global {
  namespace Express {
    interface Request {
      auth: {
        user: Omit<IUser, "createdAt">;
      };
    }
  }
}
