import type { UniversityDirection } from '../lib/universities';

type Props = {
  directions: UniversityDirection[];
  selectedId: string;
  onSelect: (direction: UniversityDirection) => void;
};

export function DirectionPicker({ directions, selectedId, onSelect }: Props) {
  return (
    <section className="choice-step" aria-labelledby="direction-picker-title">
      <div>
        <p className="eyebrow">Шаг 1</p>
        <h2 id="direction-picker-title">Что хочешь изучать?</h2>
      </div>
      <div className="direction-options">
        {directions.map((direction) => (
          <button
            className={direction.id === selectedId ? 'direction-option selected' : 'direction-option'}
            key={direction.id}
            onClick={() => onSelect(direction)}
            type="button"
          >
            <strong>{direction.name}</strong>
            <span>{direction.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
