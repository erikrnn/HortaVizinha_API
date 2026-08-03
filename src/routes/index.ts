import { Router } from 'express';
import authRoutes from './auth.routes';
import usuarioRoutes from './usuario.routes';
import produtoRoutes from './produto.routes';
import transacaoReservaRoutes from './transacaoReserva.routes';
import avaliacaoRoutes from './avaliacao.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/produtos', produtoRoutes);
router.use('/reservas', transacaoReservaRoutes);
router.use('/avaliacoes', avaliacaoRoutes);

export default router;
