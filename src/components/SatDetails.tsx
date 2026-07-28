import { useLanguage } from '../lib/language';

const resources = [
  {
    name: 'Bluebook',
    url: 'https://bluebook.collegeboard.org/students/practice',
    ru: 'Полные пробные тесты в формате настоящего Digital SAT.',
    en: 'Full-length practice tests in the real Digital SAT format.',
  },
  {
    name: 'Khan Academy',
    url: 'https://www.khanacademy.org/digital-sat',
    ru: 'Бесплатный официальный курс: Math, Reading and Writing.',
    en: 'Free official preparation for Math, Reading and Writing.',
  },
  {
    name: 'Student Question Bank',
    url: 'https://satsuite.collegeboard.org/practice/student-question-bank',
    ru: 'Тысячи официальных заданий с фильтрами по теме и сложности.',
    en: 'Thousands of official questions filtered by skill and difficulty.',
  },
];

export function SatDetails() {
  const { language } = useLanguage();
  const isRussian = language === 'ru';

  return (
    <section className="sat-details">
      <p className="eyebrow">{isRussian ? 'Подготовка к SAT' : 'SAT preparation'}</p>
      <h3>{isRussian ? 'Начни с диагностики, а не с зубрёжки' : 'Start with a diagnostic test'}</h3>
      <ol>
        <li>{isRussian
          ? 'Пройди полный пробный тест в Bluebook и запиши слабые темы.'
          : 'Take a full Bluebook practice test and note your weakest skills.'}</li>
        <li>{isRussian
          ? 'Тренируй 1–2 слабых навыка по 30–45 минут, четыре раза в неделю.'
          : 'Practice 1–2 weak skills for 30–45 minutes, four times a week.'}</li>
        <li>{isRussian
          ? 'Раз в две недели повторяй полный тест и разбирай каждую ошибку.'
          : 'Repeat a full test every two weeks and review every mistake.'}</li>
      </ol>
      <div className="sat-resources">
        {resources.map((resource) => (
          <a href={resource.url} key={resource.name} rel="noreferrer" target="_blank">
            <strong>{resource.name} ↗</strong>
            <span>{isRussian ? resource.ru : resource.en}</span>
          </a>
        ))}
      </div>
      <small>
        {isRussian
          ? 'Все ссылки ведут на бесплатные официальные ресурсы.'
          : 'All links lead to free official resources.'}
      </small>
    </section>
  );
}
