import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { autenticar } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(UsuarioController.listar));
router.get('/perfil', autenticar, asyncHandler(UsuarioController.buscarPerfil));
router.put('/perfil', autenticar, asyncHandler(UsuarioController.atualizarPerfil));
router.put('/localizacao', autenticar, asyncHandler(UsuarioController.atualizarLocalizacao));
router.delete('/perfil', autenticar, asyncHandler(UsuarioController.deletar));

export default router;
