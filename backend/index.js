import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import vaultRouter from './routes/vaultRoutes.js';

const app = express();
dotenv.config();

//console.log(process.env.PORT)
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

connectDB();

//api-endpoints
app.use('/api/auth', authRouter);
app.use('/api/vault', vaultRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

