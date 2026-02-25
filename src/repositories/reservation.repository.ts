import { ReservationModel, IReservation } from '../models/reservation.model';

/**
 * Repository for reservation persistence operations.
 */
export class ReservationRepository {
  /**
   * Create a new reservation.
   */
  async create(data: {
    bookId: string;
    fullName: string;
    phone: string;
    subdivision: string;
    comment?: string | null;
  }): Promise<IReservation> {
    const reservation = new ReservationModel({
      bookId: data.bookId,
      fullName: data.fullName,
      phone: data.phone,
      subdivision: data.subdivision,
      comment: data.comment || undefined
    });
    return reservation.save();
  }
}
