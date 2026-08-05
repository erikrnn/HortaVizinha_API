import { Router } from 'express';
import { TransacaoReservaController } from '../controllers/transacaoReserva.controller';
import { autenticar, autorizar } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', autenticar, autorizar('consumidor'), asyncHandler(TransacaoReservaController.reservar));
router.get('/minhas', autenticar, autorizar('consumidor'), asyncHandler(TransacaoReservaController.minhasReservas));
router.get('/pendentes', autenticar, autorizar('produtor'), asyncHandler(TransacaoReservaController.pendentes));
router.patch('/:id/status', autenticar, autorizar('produtor'), asyncHandler(TransacaoReservaController.atualizarStatus));
router.delete('/:id', autenticar, autorizar('consumidor'), asyncHandler(TransacaoReservaController.deletar));

export default router;
