import { Router } from 'express';
import { bookRoutes } from './book.routes';
import { categoryRoutes } from './category.routes';
import { reservationRoutes } from './reservation.routes';

const router = Router();

router.use('/books', bookRoutes);
router.use('/categories', categoryRoutes);
router.use('/reservations', reservationRoutes);

export const apiRouter = router;
