import { ReservationRepository } from '../repositories/reservation.repository';
import { BookRepository } from '../repositories/book.repository';
import { ERROR_CODES } from '../utils/constants';
import {
  ConflictError,
  NotFoundError,
  ValidationError
} from '../utils/ApiError';
import { mapReservation } from '../utils/mapper';

export interface CreateReservationInput {
  bookId: string;
  fullName: string;
  phone: string;
  subdivision: string;
  comment?: string | null;
}

/**
 * Service for reservation-related business logic.
 */
export class ReservationService {
  constructor(
    private readonly reservationRepo: ReservationRepository,
    private readonly bookRepo: BookRepository
  ) {}

  /**
   * Create a reservation and mark book as reserved.
   */
  async createReservation(input: CreateReservationInput) {
    const errors: Record<string, string> = {};

    if (!input.bookId) {
      errors.bookId = 'bookId is required';
    }
    if (!input.fullName) {
      errors.fullName = 'fullName is required';
    }
    if (!input.phone) {
      errors.phone = 'Invalid phone format';
    }
    if (!input.subdivision) {
      errors.subdivision = 'subdivision is required';
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors);
    }

    const book = await this.bookRepo.findById(input.bookId);
    if (!book) {
      throw new NotFoundError(
        ERROR_CODES.BOOK_NOT_FOUND,
        'Book with given id not found'
      );
    }

    if (book.status === 'reserved' || book.status === 'issued') {
      throw new ConflictError(
        ERROR_CODES.BOOK_NOT_RESERVABLE,
        'Book is already issued or reserved'
      );
    }

    const updatedBook = await this.bookRepo.setStatusReserved(input.bookId);
    if (!updatedBook) {
      throw new ConflictError(
        ERROR_CODES.BOOK_NOT_RESERVABLE,
        'Book is already issued or reserved'
      );
    }

    const reservation = await this.reservationRepo.create(input);

    return mapReservation(reservation, updatedBook);
  }
}
