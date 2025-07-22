import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// import authRoutes from './routes/auth.routes';
// import articleRoutes from './routes/article.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/articles', articleRoutes);

app.get('/', (_, res) => res.send('API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
