const challenges = [
  'Объясни идею покупки своими словами',
  'Назови хотя бы один настоящий риск',
  'Не вкладывай все деньги в одну компанию',
];

export function InvestorProgress({ score }: { score: number }) {
  return (
    <aside className="investor-progress">
      <div className="score-ring">
        <strong>{score}</strong>
        <span>баллов</span>
      </div>
      <div>
        <p className="eyebrow">Investor Score</p>
        <h2>Не прибыль. Качество решений.</h2>
        <p className="score-copy">Баллы даются за анализ, а не за случайную прибыль.</p>
      </div>
      <ul>
        {challenges.map((challenge, index) => (
          <li key={challenge}>
            <span>{index === 0 && score > 0 ? '✓' : index + 1}</span>
            {challenge}
          </li>
        ))}
      </ul>
    </aside>
  );
}
