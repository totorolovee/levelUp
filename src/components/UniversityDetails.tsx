import type { University } from '../lib/universities';
import { useLanguage } from '../lib/language';
import { getUniversityContent } from '../lib/universityTranslations';

export function UniversityDetails({
  university,
  specialty,
}: {
  university: University;
  specialty: string;
}) {
  const { language } = useLanguage();
  const content = getUniversityContent(university, language);
  const labels = language === 'ru'
    ? {
        tests: 'Тесты', english: 'Английский', deadlines: 'Дедлайны',
        prepare: 'Что подготовить', offers: 'Что предлагает',
        checked: 'Проверено', official: 'Официальные требования ↗',
      }
    : {
        tests: 'Tests', english: 'Language', deadlines: 'Deadlines',
        prepare: 'What to prepare', offers: 'What it offers',
        checked: 'Checked', official: 'Official requirements ↗',
      };

  return (
    <article className="university-details">
      <div className="university-title">
        <div>
          <p className="eyebrow">{content.location}</p>
          <h2>{content.name}</h2>
          <span className="selected-specialty">{specialty}</span>
          <p>{content.summary}</p>
        </div>
        <span>{content.shortName.slice(0, 2).toUpperCase()}</span>
      </div>
      <div className="requirement-grid">
        <Requirement title={labels.tests}>
          {content.testPolicy === 'required'
            ? language === 'ru'
              ? 'SAT или ACT обязательны. Проходного балла нет: заявку оценивают целиком.'
              : 'SAT or ACT is required. The application is reviewed as a whole.'
            : content.testPolicy === 'not-considered'
              ? language === 'ru'
                ? 'SAT и ACT не учитываются при решении о поступлении.'
                : 'SAT and ACT are not considered for admission.'
              : content.testNote ?? (
                language === 'ru'
                  ? 'Требования зависят от выбранной программы.'
                  : 'Requirements depend on the selected program.'
              )}
        </Requirement>
        <Requirement title={labels.english}>{content.englishNote}</Requirement>
        <Requirement title={labels.deadlines}>{content.deadlines}</Requirement>
      </div>
      <h3 className="requirements-title">
        {language === 'ru' ? 'Подробный список требований' : 'Detailed requirements checklist'}
      </h3>
      <div className="university-columns">
        <UniversityList items={content.documents} title={labels.prepare} />
        <UniversityList items={content.opportunities} title={labels.offers} />
      </div>
      <footer className="university-source">
        <span>{labels.checked}: {content.checkedAt}</span>
        <a href={content.sourceUrl} rel="noreferrer" target="_blank">
          {labels.official}
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
