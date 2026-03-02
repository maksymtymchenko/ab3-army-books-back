import http from 'http';
import https from 'https';
import { URL } from 'url';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { mapReservation } from './mapper';

type ReservationPayload = ReturnType<typeof mapReservation>;

/**
 * Send webhook to bot about newly created reservation.
 * Best-effort: failures are logged but do not break the API response.
 */
export const notifyNewReservation = async (
  reservation: ReservationPayload
): Promise<void> => {
  if (!env.notifyWebhookUrl) {
    return;
  }

  try {
    const url = new URL(env.notifyWebhookUrl);
    const isHttps = url.protocol === 'https:';

    const body = JSON.stringify({
      id: reservation.id,
      bookId: reservation.bookId,
      fullName: reservation.fullName,
      phone: reservation.phone,
      subdivision: reservation.subdivision,
      comment: reservation.comment ?? undefined,
      createdAt: reservation.createdAt,
      book: reservation.book
        ? {
            title: reservation.book.title,
            author: reservation.book.author
          }
        : undefined
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body).toString()
    };

    if (env.notifyWebhookSecret) {
      headers['X-Notify-Secret'] = env.notifyWebhookSecret;
    }

    const options: http.RequestOptions = {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: 'POST',
      headers
    };

    await new Promise<void>((resolve, reject) => {
      const req = (isHttps ? https : http).request(options, (res) => {
        // Drain response to free up the socket.
        res.on('data', () => {});
        res.on('end', () => resolve());
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.write(body);
      req.end();
    });
  } catch (err) {
    logger.warn('Failed to send new-reservation webhook', {
      error: (err as Error).message
    });
  }
};

