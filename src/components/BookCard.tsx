import type { Book } from '../lib/books';
import { BookCover } from './BookCover';

type BookCardProps = {
  book: Book;
  progress: number;
  selected: boolean;
  onChoose: () => void;
  onProgressChange: (value: number) => void;
  onSelect: (book: Book) => void;
};

export function BookCard({
  book,
  progress,
  selected,
  onChoose,
  onProgressChange,
  onSelect,
}: BookCardProps) {
  return (
    <article className={progress >= 100 ? 'book-card book-completed' : 'book-card'}>
      <BookCover book={book} />
      <div className="book-details">
        <span>{progress >= 100 ? 'Прочитано ✓' : selected ? 'В моих книгах' : book.topic}</span>
        <h2>{book.title}</h2>
        <p>{book.description}</p>
        <div className="book-actions">
          <button disabled={selected} onClick={onChoose} type="button">
            {selected ? 'Книга добавлена ✓' : 'Добавить книгу'}
          </button>
          <button onClick={() => onSelect(book)} type="button">
            Узнать о книге →
          </button>
        </div>
        <div className="book-progress">
          <div><span style={{ width: `${progress}%` }} /></div>
          <small>{progress}%</small>
        </div>
        {selected && (
          <input
            aria-label={`Прогресс книги «${book.title}»`}
            className="card-progress-slider"
            max="100"
            disabled={progress >= 100}
            min={progress}
            onChange={(event) => onProgressChange(Number(event.target.value))}
            step="2"
            type="range"
            value={progress}
          />
        )}
      </div>
    </article>
  );
}
