export type AnswerFeedback = 'correct' | 'error' | null;

type Props = {
  errorText?: string;
  isRussian: boolean;
  status: AnswerFeedback;
};

export function GameAnswerFeedback({ errorText, isRussian, status }: Props) {
  if (!status) return <div className="game-answer-feedback-slot" aria-hidden="true" />;
  const isCorrect = status === 'correct';
  return (
    <div
      aria-live={isCorrect ? 'polite' : 'assertive'}
      className={`game-answer-feedback ${status}`}
      role="status"
    >
      <span aria-hidden="true">{isCorrect ? '✓' : '!'}</span>
      <div>
        <strong>{isCorrect
          ? (isRussian ? 'Верно!' : 'Correct!')
          : (isRussian ? 'Ошибка' : 'Incorrect')}</strong>
        <small>{isCorrect
          ? (isRussian ? 'Отличная реакция — продолжай.' : 'Great reaction — keep going.')
          : errorText || (isRussian
            ? 'Ответ неверный. Сосредоточься на следующем задании.'
            : 'That answer was not correct. Focus on the next challenge.')}</small>
      </div>
    </div>
  );
}
