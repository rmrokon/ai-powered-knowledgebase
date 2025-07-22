import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Routes from './modules';
import { IUser } from './modules/users/types';

// import authRoutes from './routes/auth.routes';
// import articleRoutes from './routes/article.routes';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("this is JWT_SECRET ==> ", process.env.JWT_SECRET);
// app.use('/api/auth', authRoutes);
// app.use('/api/articles', articleRoutes);

app.get('/', (_, res) => res.send('API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.use('/v1', Routes());

declare global {
  namespace Express {
    interface Request {
      auth: {
        user: IUser;
      };
    }
  }
}
