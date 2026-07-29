import { useMemo, useState } from 'react';

const symbols = ['●', '▲', '■', '◆'];

type Props = {
  isRussian: boolean;
  roundsCount: number;
  onComplete: (score: number) => void;
};

export function AttentionTrainingGame({ isRussian, roundsCount, onComplete }: Props) {
  const rounds = useMemo(() => Array.from({ length: roundsCount }, () => {
    const common = symbols[Math.floor(Math.random() * symbols.length)];
    const odd = symbols.filter((symbol) => symbol !== common)[Math.floor(Math.random() * 3)];
    const oddIndex = Math.floor(Math.random() * 16);
    return Array.from({ length: 16 }, (_, index) => index === oddIndex ? odd : common);
  }), [roundsCount]);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const current = rounds[round];
  const common = current[0] === current[1] ? current[0] : current[2];

  const choose = (symbol: string) => {
    const nextCorrect = correct + Number(symbol !== common);
    if (round === rounds.length - 1) {
      onComplete(Math.round(nextCorrect / rounds.length * 100));
    } else {
      setCorrect(nextCorrect);
      setRound((value) => value + 1);
    }
  };

  return (
    <section className="brain-game">
      <p className="eyebrow">02 · {isRussian ? 'Внимание' : 'Attention'}</p>
      <h1>{isRussian ? 'Найди отличающийся символ' : 'Find the different symbol'}</h1>
      <p>{isRussian ? 'Раунд' : 'Round'} {round + 1} / {rounds.length}</p>
      <div className="attention-grid">
        {current.map((symbol, index) => (
          <button key={index} onClick={() => choose(symbol)} type="button">{symbol}</button>
        ))}
      </div>
    </section>
  );
}
