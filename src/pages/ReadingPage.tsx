import { useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { BookCard } from '../components/BookCard';
import { BookDetails } from '../components/BookDetails';
import { ReadingExperience } from '../components/ReadingExperience';
import { GenrePicker } from '../components/GenrePicker';
import {
  bookCategories,
  books,
  type Book,
  type BookCategory,
} from '../lib/books';
import { useReading } from '../lib/reading';

export function ReadingPage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [category, setCategory] = useState<BookCategory | null>(null);
  const { chooseBook, progress, selectedTitles, updateProgress } = useReading();
  const experience = Object.values(progress).reduce(
    (total, bookProgress) => total + bookProgress * 2,
    0,
  );
  const visibleBooks = books.filter((book) => book.category === category);
  const categoryTitle = bookCategories.find((item) => item.id === category)?.title;

  return (
    <main className="shell">
      <AppHeader />
      <section className="page-intro">
        <div>
          <p className="eyebrow">Чтение</p>
          <h1>Открой книгу. Забери идею. Создай своё.</h1>
          <p>
            Здесь каждая история может изменить твой следующий шаг.
          </p>
        </div>
      </section>
      {!category ? (
        <GenrePicker onSelect={setCategory} />
      ) : (
        <>
          <div className="category-toolbar">
            <div>
              <span>Твоя подборка</span>
              <strong>{categoryTitle}</strong>
            </div>
            <button onClick={() => setCategory(null)} type="button">
              Сменить категорию
            </button>
          </div>
          <ReadingExperience
            booksCount={selectedTitles.length}
            experience={experience}
          />

          {selectedBook && (
            <BookDetails
              book={selectedBook}
              onClose={() => setSelectedBook(null)}
            />
          )}

          <section className="book-grid" aria-label={`Книги: ${categoryTitle}`}>
            {visibleBooks.map((book) => (
              <BookCard
                book={book}
                key={book.title}
                onChoose={() => chooseBook(book.title)}
                onProgressChange={(value) => updateProgress(book.title, value)}
                onSelect={setSelectedBook}
                progress={progress[book.title] ?? 0}
                selected={selectedTitles.includes(book.title)}
              />
            ))}
          </section>
        </>
      )}
    </main>
  );
}
