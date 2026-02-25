import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { connectDb } from '../config/db';
import { BookModel, IBook } from '../models/book.model';
import { logger } from '../config/logger';
import { BookSectionTag } from '../utils/constants';

interface RawBook {
  id: number;
  author: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface BooksJson {
  library: RawBook[];
}

const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL;

if (!R2_PUBLIC_BASE_URL) {
  throw new Error('R2_PUBLIC_BASE_URL env variable is required for seeding book cover URLs');
}

const COVERS_DIR = path.resolve(__dirname, '..', '..', 'books ');

const MANUAL_COVER_MAP: Record<string, string> = {
  'Холодний Яр (2 томи)': 'Юрій_Горліс_Горський_Холодний_Яр_2_томи.webp',
  'Повість про паралельний полк (Помста чорного прапора)':
    'Р_В_Борта_Повість_про_паралельний_полк_Помста_чорного_прапора.png',
  'Сад Гетсиманський/Тигролови': 'Іван_Багряний_Тигролови.jpg'
};

const normalize = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[’'`]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-zа-яіїєґ0-9_]+/gi, '_')
    .replace(/_+/g, '_');

const coverFiles = fs
  .readdirSync(COVERS_DIR)
  // skip hidden and non-cover helper files like .DS_Store
  .filter((fileName) => !fileName.startsWith('.'));

const coverIndex = coverFiles.map((fileName) => {
  const basename = fileName.replace(/\.[^.]+$/, '');
  return {
    fileName,
    normalized: normalize(basename)
  };
});

const buildCoverUrl = (raw: RawBook): string => {
  if (MANUAL_COVER_MAP[raw.title]) {
    const fileName = MANUAL_COVER_MAP[raw.title];
    const objectKey = `books/${encodeURIComponent(fileName)}`;
    return `${R2_PUBLIC_BASE_URL}/${objectKey}`;
  }

  const normalizedTitle = normalize(raw.title);

  const match = coverIndex.find((entry) => {
    // exact title-only match
    if (entry.normalized === normalizedTitle) return true;
    // filename pattern Author_Title → ends with _{title}
    if (entry.normalized.endsWith(`_${normalizedTitle}`)) return true;
    // fallback: title contained anywhere
    return entry.normalized.includes(normalizedTitle);
  });

  if (!match) {
    logger.warn('No local cover image found, falling back to original imageUrl', {
      title: raw.title,
      author: raw.author,
      imageUrl: raw.imageUrl
    });
    // Fallback: keep original imageUrl so seeding does not fail
    return raw.imageUrl;
  }

  const objectKey = `books/${encodeURIComponent(match.fileName)}`;
  return `${R2_PUBLIC_BASE_URL}/${objectKey}`;
};

const buildSectionTags = (id: number): BookSectionTag[] => {
  const tags: BookSectionTag[] = [];

  // First 20 books → recommended
  if (id <= 20) {
    tags.push('recommended');
  }

  // Last ~20 books → new
  if (id >= 40) {
    tags.push('new');
  }

  // Every 5th book → commander recommends
  if (id % 5 === 0) {
    tags.push('commander');
  }

  return tags;
};

/**
 * Transform raw JSON book into IBook-compatible payload.
 */
const transformBook = (raw: RawBook): Partial<IBook> => {
  return {
    title: raw.title,
    author: raw.author,
    coverUrl: buildCoverUrl(raw),
    description: raw.description,
    status: 'in_stock',
    popularityScore: 100 - raw.id,
    sectionTags: buildSectionTags(raw.id)
  };
};

/**
 * Seed MongoDB with books from books.json.
 */
const seed = async () => {
  try {
    await connectDb();

    const jsonPath = path.resolve(__dirname, '..', '..', 'books.json');
    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    const parsed: BooksJson = JSON.parse(fileContent);

    if (!parsed.library || !Array.isArray(parsed.library)) {
      throw new Error('Invalid books.json format: missing "library" array');
    }

    const payloads = parsed.library.map(transformBook);

    // Optional: clear existing collection before seeding
    await BookModel.deleteMany({});

    await BookModel.insertMany(payloads);

    logger.info(`Seeded ${payloads.length} books from books.json`);
  } catch (err) {
    logger.error('Failed to seed books', {
      errorMessage: err instanceof Error ? err.message : String(err),
      errorStack: err instanceof Error ? err.stack : undefined
    });
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

// Execute only when run directly with Node/ts-node
void seed();

