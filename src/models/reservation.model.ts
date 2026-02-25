import { Schema, model, Document, Types } from 'mongoose';
import {
  ReservationStatus,
  RESERVATION_STATUS
} from '../utils/constants';

export interface IReservation extends Document {
  bookId: Types.ObjectId;
  fullName: string;
  phone: string;
  subdivision: string;
  comment?: string;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new Schema<IReservation>(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
      index: true
    },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    subdivision: { type: String, required: true, trim: true },
    comment: { type: String, trim: true },
    status: {
      type: String,
      enum: RESERVATION_STATUS,
      required: true,
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

reservationSchema.index({ phone: 1, createdAt: -1 });

export const ReservationModel = model<IReservation>(
  'Reservation',
  reservationSchema
);
