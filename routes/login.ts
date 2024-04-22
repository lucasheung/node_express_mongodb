import express from 'express';
import { checkUserLogin, registerUser } from '../controller/login.controller';

export const router = express.Router();

router.post('/login', checkUserLogin);
router.post('/register', registerUser);
export default router;
