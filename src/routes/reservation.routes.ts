import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.controller';
import { reservationRateLimiter } from '../middlewares/rateLimiter';
import { validate } from '../middlewares/validation';
import {
  createReservationBodySchema,
  getReservationByIdParamsSchema,
  getReservationsQuerySchema,
  updateReservationStatusBodySchema
} from '../utils/validationSchemas';

const router = Router();

router.get(
  '/',
  validate(getReservationsQuerySchema, 'query'),
  ReservationController.list
);

router.post(
  '/',
  reservationRateLimiter,
  validate(createReservationBodySchema, 'body'),
  ReservationController.createReservation
);

router.get(
  '/:id',
  validate(getReservationByIdParamsSchema, 'params'),
  ReservationController.getById
);

router.patch(
  '/:id/status',
  validate(getReservationByIdParamsSchema, 'params'),
  validate(updateReservationStatusBodySchema, 'body'),
  ReservationController.updateStatus
);

export const reservationRoutes = router;
