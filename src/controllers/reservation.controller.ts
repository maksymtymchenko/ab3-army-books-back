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
}
