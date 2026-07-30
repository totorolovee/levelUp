type Props = {
  isRussian: boolean;
  reviewed: boolean;
  onToggle: () => void;
};

export function ResearchReviewButton({ isRussian, reviewed, onToggle }: Props) {
  return (
    <button
      aria-pressed={reviewed}
      className={reviewed ? 'research-review reviewed' : 'research-review'}
      onClick={onToggle}
      type="button"
    >
      {reviewed ? '✓ ' : ''}
      {isRussian
        ? (reviewed ? 'Изучено' : 'Отметить как изученное')
        : (reviewed ? 'Reviewed' : 'Mark as reviewed')}
    </button>
  );
}
