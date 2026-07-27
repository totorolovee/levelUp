import { bookCategories, type BookCategory } from '../lib/books';

export function GenrePicker({
  onSelect,
}: {
  onSelect: (category: BookCategory) => void;
}) {
  return (
    <section className="genre-picker">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Выбери свою вселенную</p>
          <h2>Куда исчезнем на пару глав?</h2>
        </div>
      </div>
      <div className="genre-grid">
        {bookCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            type="button"
          >
            <span>{category.icon}</span>
            <div>
              <strong>{category.title}</strong>
              <p>{category.description}</p>
            </div>
            <b>→</b>
          </button>
        ))}
      </div>
    </section>
  );
}
