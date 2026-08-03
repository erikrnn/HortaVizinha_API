import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
  },
  filename: (_req, file, cb) => {
    const nomeUnico = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, nomeUnico);
  },
});

function filtroDeArquivo(_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
  if (!tiposPermitidos.includes(file.mimetype)) {
    return cb(new Error('Formato de imagem invalido. Use JPEG, PNG ou WEBP.'));
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter: filtroDeArquivo,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
