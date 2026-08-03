import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/registrar', asyncHandler(AuthController.registrar));
router.post('/login', asyncHandler(AuthController.login));

export default router;
