import express from 'express';
import {
  signupUserController,
  login,
  forgotPassword,
  signupCreatorController,
  loginCreator,
  forgotPasswordCreator,
  applyAsCreatorController,
  verifyCreatorController
  
} from '../controllers/authController.js';

import { creatorApplicationController } from '../controllers/creatorController.js';

const router = express.Router();

router.post('/register/user', signupUserController);
router.post('/login/user', login);
router.post('/forgot-password', forgotPassword);
router.post('/register/creator', signupCreatorController);
router.post('/login/creator', loginCreator);
router.post('/forgot-password/creator', forgotPasswordCreator);
// router.post('/apply/creator', applyAsCreatorController);
router.post('/apply/creator', creatorApplicationController);
router.post('/verify/creator', verifyCreatorController);

export default router;
