import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { env } from '../config/env';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: env.r2Endpoint,
  credentials: {
    accessKeyId: env.r2AccessKeyId,
    secretAccessKey: env.r2SecretAccessKey
  }
});

export interface UploadBookCoverParams {
  buffer: Buffer;
  mimeType: string;
  originalName?: string;
}

/**
 * Upload book cover image to Cloudflare R2 and return public URL.
 */
export const uploadBookCover = async (
  params: UploadBookCoverParams
): Promise<string> => {
  const { buffer, mimeType, originalName } = params;

  const extensionFromMime =
    mimeType === 'image/png'
      ? 'png'
      : mimeType === 'image/webp'
      ? 'webp'
      : mimeType === 'image/gif'
      ? 'gif'
      : 'jpg';

  const safeName = originalName
    ? originalName.replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase()
    : '';

  const key = `books/${randomUUID()}${safeName ? `-${safeName}` : ''}.${extensionFromMime}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: env.r2BucketName,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ACL: 'public-read'
    })
  );

  const base =
    env.r2PublicBaseUrl.replace(/\/+$/, '') || env.r2Endpoint.replace(/\/+$/, '');

  return `${base}/${key}`;
};

