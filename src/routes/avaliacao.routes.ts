import { Router } from 'express';
import { AvaliacaoController } from '../controllers/avaliacao.controller';
import { autenticar } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/', autenticar, asyncHandler(AvaliacaoController.criar));
router.get('/usuario/:usuarioId', asyncHandler(AvaliacaoController.listarPorUsuario));
router.get('/:id', asyncHandler(AvaliacaoController.buscarPorId));
router.put('/:id', autenticar, asyncHandler(AvaliacaoController.atualizar));
router.delete('/:id', autenticar, asyncHandler(AvaliacaoController.deletar));

export default router;
