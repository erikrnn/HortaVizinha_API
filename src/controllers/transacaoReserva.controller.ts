import { Request, Response } from 'express';
import { TransacaoReservaService } from '../services/transacaoReserva.service';
import { criarReservaSchema, atualizarStatusReservaSchema } from '../validations/transacaoReserva.schema';

export const TransacaoReservaController = {
  async reservar(req: Request, res: Response) {
    const dados = criarReservaSchema.parse(req.body);
    const reserva = await TransacaoReservaService.reservar(
      req.usuario!.id,
      dados.produto_id,
      dados.quantidade_reservada,
    );
    return res.status(201).json(reserva);
  },

  async minhasReservas(req: Request, res: Response) {
    const reservas = await TransacaoReservaService.listarPorConsumidor(req.usuario!.id);
    return res.json(reservas);
  },

  // Produtor visualiza as reservas pendentes de aprovacao dos seus produtos
  async pendentes(req: Request, res: Response) {
    const reservas = await TransacaoReservaService.listarPendentesPorProdutor(req.usuario!.id);
    return res.json(reservas);
  },

  // Produtor aprova, rejeita ou confirma entrega
  async atualizarStatus(req: Request, res: Response) {
    const dados = atualizarStatusReservaSchema.parse(req.body);
    const reserva = await TransacaoReservaService.atualizarStatus(req.params.id, req.usuario!.id, dados.status);
    return res.json(reserva);
  },

  async deletar(req: Request, res: Response) {
    await TransacaoReservaService.deletar(req.params.id, req.usuario!.id);
    return res.status(204).send();
  },
};
