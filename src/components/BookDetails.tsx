import type { Book } from '../lib/books';

type BookDetailsProps = {
  book: Book;
  onClose: () => void;
};

export function BookDetails({
  book,
  onClose,
}: BookDetailsProps) {
  return (
    <section className="book-about">
      <button aria-label="Закрыть описание" onClick={onClose} type="button">
        ×
      </button>
      <p className="eyebrow">Без спойлеров · {book.topic}</p>
      <h2>{book.title}</h2>
      <span className="book-author">{book.author}</span>
      <p>{book.overview}</p>
      <div className="book-takeaway">
        <strong>Что ты можешь узнать</strong>
        <p>{book.takeaway}</p>
      </div>
    </section>
  );
}
