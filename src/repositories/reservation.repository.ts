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

  /**
   * Find reservations with optional status filter and pagination.
   */
  async findMany(
    page: number,
    pageSize: number,
    status?: string
  ): Promise<{ items: IReservation[]; total: number }> {
    const query: Record<string, unknown> = {};
    if (status) {
      query.status = status;
    }

    const [items, total] = await Promise.all([
      ReservationModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate('bookId', 'title author status')
        .exec(),
      ReservationModel.countDocuments(query).exec()
    ]);

    return { items, total };
  }

  /**
   * Find reservation by id.
   */
  async findById(id: string): Promise<IReservation | null> {
    return ReservationModel.findById(id)
      .populate('bookId', 'title author status')
      .exec();
  }

  /**
   * Update reservation status. Returns updated reservation with book populated.
   */
  async updateStatus(
    id: string,
    status: string
  ): Promise<IReservation | null> {
    return ReservationModel.findByIdAndUpdate(id, { $set: { status } }, { new: true })
      .populate('bookId', 'title author status')
      .exec();
  }
}
