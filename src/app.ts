import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errorMiddleware } from './middlewares/error.middleware';

export const app = express();

app.use(cors());
app.use(express.json());

// arquivos de imagem enviados (fotos dos produtos)
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.get('/', (_req, res) => {
  res.json({ mensagem: 'API HortaVizinha no ar', docs: '/api-docs (ver docs/api.md)' });
});

app.use('/api', routes);

// middleware de erro deve ser o ultimo a ser registrado
app.use(errorMiddleware);
