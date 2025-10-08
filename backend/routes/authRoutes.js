import express from 'express';
import { login, reverifyAndDelete, reverifyAndEdit, signUp } from '../controllers/authControllers.js';
import { userAuth } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', login);
authRouter.post('/reverify-delete/:id',userAuth, reverifyAndDelete);
authRouter.patch('/reverify-edit/:id',userAuth, reverifyAndEdit);

export default authRouter;