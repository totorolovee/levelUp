export function PurchaseResearchGate({ isRussian }: { isRussian: boolean }) {
  return (
    <aside className="purchase-research-gate">
      <span>🔒</span>
      <p className="eyebrow">Reflection</p>
      <h2>{isRussian ? 'Покупка откроется после исследования' : 'Research before buying'}</h2>
      <p>{isRussian
        ? 'Изучи четыре блока Research Hub и создай AI-резюме. После этого ответь на три вопроса о своём решении.'
        : 'Review all four Research Hub sections and create the AI summary. Then answer three questions about your decision.'}</p>
      <ol>
        <li>{isRussian ? 'Почему именно эта компания?' : 'Why this company?'}</li>
        <li>{isRussian ? 'Какой главный риск?' : 'What is the main risk?'}</li>
        <li>{isRussian ? 'Когда ты признаешь ошибку?' : 'When would you admit the thesis is wrong?'}</li>
      </ol>
    </aside>
  );
}
