import type { University } from '../lib/universities';

export function UniversityDetails({
  university,
  specialty,
}: {
  university: University;
  specialty: string;
}) {
  return (
    <article className="university-details">
      <div className="university-title">
        <div>
          <p className="eyebrow">{university.location}</p>
          <h2>{university.name}</h2>
          <span className="selected-specialty">{specialty}</span>
          <p>{university.summary}</p>
        </div>
        <span>{university.shortName.slice(0, 2).toUpperCase()}</span>
      </div>
      <div className="requirement-grid">
        <Requirement title="Тесты">
          {university.testPolicy === 'required'
            ? 'SAT или ACT обязательны. Проходного балла нет: заявку оценивают целиком.'
            : university.testPolicy === 'not-considered'
              ? 'SAT и ACT не учитываются при решении о поступлении.'
              : university.testNote ?? 'Требования зависят от выбранной программы.'}
        </Requirement>
        <Requirement title="Английский">{university.englishNote}</Requirement>
        <Requirement title="Дедлайны">{university.deadlines}</Requirement>
      </div>
      <div className="university-columns">
        <UniversityList items={university.documents} title="Что подготовить" />
        <UniversityList items={university.opportunities} title="Что предлагает" />
      </div>
      <footer className="university-source">
        <span>Проверено: {university.checkedAt}</span>
        <a href={university.sourceUrl} rel="noreferrer" target="_blank">
          Официальные требования ↗
        </a>
      </footer>
    </article>
  );
}

function Requirement({ children, title }: { children: string; title: string }) {
  return (
    <div>
      <span>{title}</span>
      <p>{children}</p>
    </div>
  );
}

function UniversityList({ items, title }: { items: string[]; title: string }) {
  return (
    <section>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}
