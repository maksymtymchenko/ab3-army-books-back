import { Request, Response, NextFunction } from 'express';
import { ReservationService } from '../services/reservation.service';
import { ReservationRepository } from '../repositories/reservation.repository';
import { BookRepository } from '../repositories/book.repository';

const reservationService = new ReservationService(
  new ReservationRepository(),
  new BookRepository()
);

/**
 * Controller for reservation endpoints.
 */
export class ReservationController {
  static async createReservation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bookId, fullName, phone, subdivision, comment } = req.body;

      const result = await reservationService.createReservation({
        bookId,
        fullName,
        phone,
        subdivision,
        comment
      });

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async list(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, pageSize, status } = req.query as any;
      const pageNum = Number(page) || 1;
      const pageSizeNum = Number(pageSize) || 20;

      const data = await reservationService.listReservations(
        pageNum,
        pageSizeNum,
        status
      );
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const data = await reservationService.getById(id);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body as { status: string };
      const data = await reservationService.updateStatus(id, status);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}
