import { useState } from 'react';

type DecisionReviewProps = {
  lesson?: string;
  onSave: (lesson: string) => void;
};

export function DecisionReview({ lesson, onSave }: DecisionReviewProps) {
  const [answer, setAnswer] = useState(lesson ?? '');

  if (lesson) {
    return (
      <div className="saved-lesson">
        <span>Главный вывод</span>
        <p>{lesson}</p>
      </div>
    );
  }

  return (
    <div className="decision-review">
      <label>
        Что ты понял после этого решения?
        <textarea
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Моя логика была хорошей, потому что..."
          rows={3}
          value={answer}
        />
      </label>
      <button
        disabled={answer.trim().length < 10}
        onClick={() => onSave(answer.trim())}
        type="button"
      >
        Сохранить вывод
      </button>
    </div>
  );
}
