import { Router } from 'express';
import { ProdutoController } from '../controllers/produto.controller';
import { autenticar, autorizar } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/mapa', asyncHandler(ProdutoController.buscarPorRaio));
router.get('/meus', autenticar, autorizar('produtor'), asyncHandler(ProdutoController.listarMeusProdutos));
router.get('/:id', asyncHandler(ProdutoController.buscarPorId));

router.post(
  '/',
  autenticar,
  autorizar('produtor'),
  upload.single('foto'),
  asyncHandler(ProdutoController.criar),
);
router.put('/:id', autenticar, autorizar('produtor'), asyncHandler(ProdutoController.atualizar));
router.delete('/:id', autenticar, autorizar('produtor'), asyncHandler(ProdutoController.deletar));

export default router;
