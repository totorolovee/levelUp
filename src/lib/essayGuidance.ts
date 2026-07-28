import type { University } from './universities';

export type EssayGuidance = {
  title: string;
  items: string[];
  sourceUrl: string;
};

const ucasQuestions = [
  'Почему ты хочешь изучать выбранный предмет?',
  'Как учёба и школьные предметы подготовили тебя к этому направлению?',
  'Что ты сделал вне школы и чему тебя научил этот опыт?',
];

export function getEssayGuidance(university: University): EssayGuidance {
  if (university.id === 'stanford') {
    return {
      title: 'Что написать для Stanford',
      items: [
        'Основное эссе Common Application.',
        'Несколько коротких ответов — до 50 слов каждый.',
        'Три Stanford-эссе по 100–250 слов: интерес к обучению, письмо будущему соседу и твой вклад в сообщество.',
      ],
      sourceUrl: 'https://admission.stanford.edu/apply/first-year/apply.html',
    };
  }

  if (university.id === 'mit') {
    return {
      title: 'Что написать для MIT',
      items: [
        'Вместо одного длинного эссе MIT просит несколько коротких ответов.',
        'Основные ответы — примерно по 100–200 слов; дополнительные — по 40–50 слов.',
        'Пиши о своём интересе к предмету, нестандартном пути, задачах, которые хочешь решать, и неожиданном испытании.',
      ],
      sourceUrl: 'https://mitadmissions.org/apply/firstyear/essays-activities-academics/',
    };
  }

  if (university.id === 'oxford') {
    return {
      title: 'Что написать для Oxford',
      items: [
        ...ucasQuestions,
        'Сосредоточься на академическом интересе к предмету: книгах, проектах и идеях, которые ты исследовал.',
        'Для некоторых курсов отдельно нужна письменная работа — проверь страницу курса.',
      ],
      sourceUrl: 'https://www.ox.ac.uk/admissions/undergraduate/applying/guide-for-applicants/ucas-application',
    };
  }

  if (['cambridge', 'imperial', 'st-andrews', 'edinburgh', 'lse', 'kings', 'manchester'].includes(university.id)) {
    return {
      title: `Что написать для ${university.shortName}`,
      items: [
        ...ucasQuestions,
        'На все три ответа вместе даётся до 4 000 знаков.',
        'Связывай каждый пример с выбранным предметом и объясняй, чему ты научился.',
      ],
      sourceUrl: 'https://www.ucas.com/advisers/help-and-training/toolkits/personal-statement-toolkit',
    };
  }

  if (university.id === 'berkeley') {
    return {
      title: 'Что написать для UC Berkeley',
      items: [
        'Заявка University of California использует Personal Insight Questions.',
        'Выбирай истории, которые показывают инициативу, развитие, интерес к предмету и вклад в сообщество.',
        'Проверяй актуальные вопросы и лимиты в UC Application перед началом работы.',
      ],
      sourceUrl: university.sourceUrl,
    };
  }

  if (['harvard', 'princeton', 'yale', 'caltech'].includes(university.id)) {
    return {
      title: `Что написать для ${university.shortName}`,
      items: [
        'Основное личное эссе Common Application.',
        `Отдельные вопросы и короткие эссе ${university.shortName} внутри приложения.`,
        'Покажи конкретными историями свой интерес к учёбе, характер и возможный вклад в сообщество.',
      ],
      sourceUrl: university.sourceUrl,
    };
  }

  return {
    title: `Что написать для ${university.shortName}`,
    items: [
      'Personal statement или учебный план из официальной формы этого университета.',
      'Объясни выбор направления и подкрепи его школьными проектами, олимпиадами или самостоятельной работой.',
      'Перед отправкой проверь актуальные вопросы и лимиты в портале поступления.',
    ],
    sourceUrl: university.sourceUrl,
  };
}
