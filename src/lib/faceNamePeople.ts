export type FaceNamePerson = {
  column: number;
  correction: { ru: string; en: string };
  intro: { ru: string; en: string };
  name: { ru: string; en: string };
  recall: { ru: string; en: string };
  row: number;
};

export const faceNamePeople: FaceNamePerson[] = [
  {
    name: { ru: 'Алекс', en: 'Alex' }, column: 0, row: 0,
    intro: {
      ru: 'Привет! Меня зовут Алекс. Хочешь купить лимонад? Я открыл стойку возле парка.',
      en: 'Hi! My name is Alex. Would you like to buy some lemonade? I run a stand by the park.',
    },
    recall: {
      ru: 'Я продаю лимонад возле парка. Помнишь, как меня зовут?',
      en: 'I sell lemonade by the park. Do you remember my name?',
    },
    correction: { ru: 'Я Алекс — я продаю лимонад возле парка.', en: 'I am Alex — I sell lemonade by the park.' },
  },
  {
    name: { ru: 'Майя', en: 'Maya' }, column: 1, row: 0,
    intro: {
      ru: 'Привет! Я Майя. Я фотографирую животных. Сегодня ищу отличный кадр для выставки.',
      en: 'Hi! I am Maya. I photograph animals. Today I am looking for a great shot for an exhibition.',
    },
    recall: {
      ru: 'Я фотографирую животных для выставки. Вспомнишь моё имя?',
      en: 'I photograph animals for exhibitions. Can you recall my name?',
    },
    correction: { ru: 'Я Майя — я фотографирую животных.', en: 'I am Maya — I photograph animals.' },
  },
  {
    name: { ru: 'Дэниел', en: 'Daniel' }, column: 2, row: 0,
    intro: {
      ru: 'Приятно познакомиться! Я Дэниел. Я чиню велосипеды и готовлю их к большим поездкам.',
      en: 'Nice to meet you! I am Daniel. I repair bicycles and prepare them for long rides.',
    },
    recall: {
      ru: 'Я чиню велосипеды перед большими поездками. Как меня зовут?',
      en: 'I repair bicycles before long rides. What is my name?',
    },
    correction: { ru: 'Я Дэниел — я чиню велосипеды.', en: 'I am Daniel — I repair bicycles.' },
  },
  {
    name: { ru: 'София', en: 'Sofia' }, column: 3, row: 0,
    intro: {
      ru: 'Привет! Меня зовут София. Я выращиваю цветы и составляю букеты для соседей.',
      en: 'Hi! My name is Sofia. I grow flowers and arrange bouquets for my neighbors.',
    },
    recall: {
      ru: 'Я выращиваю цветы и составляю букеты. Ты помнишь моё имя?',
      en: 'I grow flowers and arrange bouquets. Do you remember my name?',
    },
    correction: { ru: 'Я София — я выращиваю цветы.', en: 'I am Sofia — I grow flowers.' },
  },
  {
    name: { ru: 'Лео', en: 'Leo' }, column: 0, row: 1,
    intro: {
      ru: 'Доброе утро! Я Лео. Я пеку круассаны и каждое утро открываю маленькую пекарню.',
      en: 'Good morning! I am Leo. I bake croissants and open my little bakery every morning.',
    },
    recall: {
      ru: 'Я каждое утро пеку круассаны. Сможешь назвать моё имя?',
      en: 'I bake croissants every morning. Can you tell me my name?',
    },
    correction: { ru: 'Я Лео — я пеку круассаны.', en: 'I am Leo — I bake croissants.' },
  },
  {
    name: { ru: 'Амина', en: 'Amina' }, column: 1, row: 1,
    intro: {
      ru: 'Привет! Я Амина. Я веду книжный клуб и каждую неделю выбираю новую историю.',
      en: 'Hi! I am Amina. I run a book club and choose a new story every week.',
    },
    recall: {
      ru: 'Я веду еженедельный книжный клуб. Как меня зовут?',
      en: 'I run a weekly book club. What is my name?',
    },
    correction: { ru: 'Я Амина — я веду книжный клуб.', en: 'I am Amina — I run a book club.' },
  },
  {
    name: { ru: 'Ноа', en: 'Noah' }, column: 2, row: 1,
    intro: {
      ru: 'Рад знакомству! Я Ноа. Я учу играть на гитаре и помогаю ученикам написать первую песню.',
      en: 'Glad to meet you! I am Noah. I teach guitar and help students write their first song.',
    },
    recall: {
      ru: 'Я учу играть на гитаре. Ты помнишь моё имя?',
      en: 'I teach people to play guitar. Do you remember my name?',
    },
    correction: { ru: 'Я Ноа — я преподаю игру на гитаре.', en: 'I am Noah — I teach guitar.' },
  },
  {
    name: { ru: 'Зои', en: 'Zoe' }, column: 3, row: 1,
    intro: {
      ru: 'Привет! Меня зовут Зои. Я дизайнер и создаю яркие афиши для городских событий.',
      en: 'Hi! My name is Zoe. I am a designer and create colorful posters for city events.',
    },
    recall: {
      ru: 'Я создаю афиши для городских событий. Вспомнишь моё имя?',
      en: 'I design posters for city events. Can you recall my name?',
    },
    correction: { ru: 'Я Зои — я создаю афиши.', en: 'I am Zoe — I design posters.' },
  },
];
