import express from 'express';
import { userAuth } from '../middleware/authMiddleware.js';
import { addVaultItem, deleteVaultItem, editVaultItem, getVaultItems } from '../controllers/vaultControllers.js';
const vaultRouter = express.Router();

vaultRouter.post('/add', userAuth, addVaultItem);
vaultRouter.get('/get', userAuth, getVaultItems);
vaultRouter.patch('/update/:id', userAuth, editVaultItem);
vaultRouter.delete('/delete/:id', userAuth, deleteVaultItem);

export default vaultRouter;