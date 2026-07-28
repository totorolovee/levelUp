import { useEffect, useState } from 'react';
import type { Book } from '../lib/books';

type BooksResponse = {
  items?: Array<{
    volumeInfo?: {
      imageLinks?: { thumbnail?: string };
    };
  }>;
};

const coverCache = new Map<string, string | null>();

export function BookCover({ book }: { book: Book }) {
  const cacheKey = `${book.title}-${book.author}`;
  const [coverUrl, setCoverUrl] = useState<string | null>(
    book.coverUrl ?? coverCache.get(cacheKey) ?? null,
  );

  useEffect(() => {
    if (book.coverUrl) return;
    if (coverCache.has(cacheKey)) return;
    const controller = new AbortController();
    const query = encodeURIComponent(`intitle:${book.title} inauthor:${book.author}`);

    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1&projection=lite`,
      { signal: controller.signal },
    )
      .then((response) => response.json() as Promise<BooksResponse>)
      .then((data) => {
        const thumbnail = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
        const secureUrl = thumbnail?.replace('http://', 'https://') ?? null;
        coverCache.set(cacheKey, secureUrl);
        setCoverUrl(secureUrl);
      })
      .catch(() => coverCache.set(cacheKey, null));

    return () => controller.abort();
  }, [book.author, book.coverUrl, book.title, cacheKey]);

  if (coverUrl) {
    return (
      <div className="book-cover real-book-cover">
        <img
          alt={`Обложка книги «${book.title}»`}
          loading="lazy"
          onError={() => setCoverUrl(null)}
          src={coverUrl}
        />
      </div>
    );
  }

  return (
    <div className="book-cover" style={{ background: book.color }}>
      <span>{book.topic}</span>
      <strong>{book.title}</strong>
      <small>{book.author}</small>
    </div>
  );
}
