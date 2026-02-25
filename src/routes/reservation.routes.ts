import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.controller';
import { reservationRateLimiter } from '../middlewares/rateLimiter';
import { validate } from '../middlewares/validation';
import { createReservationBodySchema } from '../utils/validationSchemas';

const router = Router();

router.post(
  '/',
  reservationRateLimiter,
  validate(createReservationBodySchema, 'body'),
  ReservationController.createReservation
);

export const reservationRoutes = router;
