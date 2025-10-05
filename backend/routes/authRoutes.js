import express from 'express';
import { login, reverifyPassword, signUp } from '../controllers/authControllers.js';

const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', login);
authRouter.post('/reverify', reverifyPassword);

export default authRouter;