export type LocalizedText = { ru: string; en: string };

export type FaceNameProfile = {
  column: number;
  intro: LocalizedText;
  recall: LocalizedText;
  role: LocalizedText;
  row: number;
  sprite: 'base' | 'extra';
};

export const faceNameNames: LocalizedText[] = [
  { ru: 'Алекс', en: 'Alex' }, { ru: 'Майя', en: 'Maya' },
  { ru: 'Дэниел', en: 'Daniel' }, { ru: 'София', en: 'Sofia' },
  { ru: 'Лео', en: 'Leo' }, { ru: 'Амина', en: 'Amina' },
  { ru: 'Ноа', en: 'Noah' }, { ru: 'Зои', en: 'Zoe' },
  { ru: 'Эмма', en: 'Emma' }, { ru: 'Лукас', en: 'Lucas' },
  { ru: 'Нина', en: 'Nina' }, { ru: 'Омар', en: 'Omar' },
  { ru: 'Ева', en: 'Eva' }, { ru: 'Макс', en: 'Max' },
  { ru: 'Лина', en: 'Lina' }, { ru: 'Сэм', en: 'Sam' },
  { ru: 'Мила', en: 'Mila' }, { ru: 'Адам', en: 'Adam' },
  { ru: 'Нора', en: 'Nora' }, { ru: 'Бен', en: 'Ben' },
];

export const faceNameProfiles: FaceNameProfile[] = [
  {
    sprite: 'base', column: 0, row: 0,
    intro: { ru: 'Хочешь купить лимонад? Я открыл стойку возле парка.', en: 'Would you like some lemonade? I run a stand by the park.' },
    recall: { ru: 'Я продаю лимонад возле парка. Помнишь моё имя?', en: 'I sell lemonade by the park. Do you remember my name?' },
    role: { ru: 'я продаю лимонад возле парка', en: 'I sell lemonade by the park' },
  },
  {
    sprite: 'base', column: 1, row: 0,
    intro: { ru: 'Я фотографирую животных. Сегодня ищу отличный кадр для выставки.', en: 'I photograph animals. Today I am looking for a great exhibition shot.' },
    recall: { ru: 'Я фотографирую животных для выставок. Как меня зовут?', en: 'I photograph animals for exhibitions. What is my name?' },
    role: { ru: 'я фотографирую животных', en: 'I photograph animals' },
  },
  {
    sprite: 'base', column: 2, row: 0,
    intro: { ru: 'Я чиню велосипеды и готовлю их к большим поездкам.', en: 'I repair bicycles and prepare them for long rides.' },
    recall: { ru: 'Я чиню велосипеды перед поездками. Помнишь моё имя?', en: 'I repair bicycles before long rides. Do you remember my name?' },
    role: { ru: 'я чиню велосипеды', en: 'I repair bicycles' },
  },
  {
    sprite: 'base', column: 3, row: 0,
    intro: { ru: 'Я выращиваю цветы и составляю букеты для соседей.', en: 'I grow flowers and arrange bouquets for my neighbors.' },
    recall: { ru: 'Я выращиваю цветы и составляю букеты. Как меня зовут?', en: 'I grow flowers and arrange bouquets. What is my name?' },
    role: { ru: 'я выращиваю цветы', en: 'I grow flowers' },
  },
  {
    sprite: 'base', column: 0, row: 1,
    intro: { ru: 'Я пеку круассаны и каждое утро открываю маленькую пекарню.', en: 'I bake croissants and open my little bakery every morning.' },
    recall: { ru: 'Я каждое утро пеку круассаны. Помнишь моё имя?', en: 'I bake croissants every morning. Do you remember my name?' },
    role: { ru: 'я пеку круассаны', en: 'I bake croissants' },
  },
  {
    sprite: 'base', column: 1, row: 1,
    intro: { ru: 'Я веду книжный клуб и каждую неделю выбираю новую историю.', en: 'I run a book club and choose a new story every week.' },
    recall: { ru: 'Я веду еженедельный книжный клуб. Как меня зовут?', en: 'I run a weekly book club. What is my name?' },
    role: { ru: 'я веду книжный клуб', en: 'I run a book club' },
  },
  {
    sprite: 'base', column: 2, row: 1,
    intro: { ru: 'Я учу играть на гитаре и помогаю написать первую песню.', en: 'I teach guitar and help students write their first song.' },
    recall: { ru: 'Я учу играть на гитаре. Помнишь моё имя?', en: 'I teach people to play guitar. Do you remember my name?' },
    role: { ru: 'я преподаю игру на гитаре', en: 'I teach guitar' },
  },
  {
    sprite: 'base', column: 3, row: 1,
    intro: { ru: 'Я дизайнер и создаю яркие афиши для городских событий.', en: 'I am a designer and create colorful posters for city events.' },
    recall: { ru: 'Я создаю афиши для городских событий. Как меня зовут?', en: 'I design posters for city events. What is my name?' },
    role: { ru: 'я создаю афиши', en: 'I design posters' },
  },
  {
    sprite: 'extra', column: 0, row: 0,
    intro: { ru: 'Я восстанавливаю старинные карты для городского музея.', en: 'I restore antique maps for the city museum.' },
    recall: { ru: 'Я восстанавливаю старинные карты. Помнишь моё имя?', en: 'I restore antique maps. Do you remember my name?' },
    role: { ru: 'я восстанавливаю старинные карты', en: 'I restore antique maps' },
  },
  {
    sprite: 'extra', column: 1, row: 0,
    intro: { ru: 'Я обжариваю кофе и ищу новые вкусы для маленького кафе.', en: 'I roast coffee and find new flavors for a small café.' },
    recall: { ru: 'Я обжариваю кофе для маленького кафе. Как меня зовут?', en: 'I roast coffee for a small café. What is my name?' },
    role: { ru: 'я обжариваю кофе', en: 'I roast coffee' },
  },
  {
    sprite: 'extra', column: 2, row: 0,
    intro: { ru: 'Я выращиваю овощи в саду на крыше школы.', en: 'I grow vegetables in a garden on the school roof.' },
    recall: { ru: 'Я ухаживаю за садом на крыше. Помнишь моё имя?', en: 'I care for a rooftop garden. Do you remember my name?' },
    role: { ru: 'я выращиваю сад на крыше', en: 'I grow a rooftop garden' },
  },
  {
    sprite: 'extra', column: 0, row: 1,
    intro: { ru: 'Я снимаю короткие фильмы о людях нашего города.', en: 'I make short documentaries about people in our city.' },
    recall: { ru: 'Я снимаю фильмы о жителях города. Как меня зовут?', en: 'I film stories about people in the city. What is my name?' },
    role: { ru: 'я снимаю документальные фильмы', en: 'I make documentaries' },
  },
  {
    sprite: 'extra', column: 1, row: 1,
    intro: { ru: 'Я веду мастерскую робототехники и собираю маленьких роботов.', en: 'I run a robotics workshop and build small robots.' },
    recall: { ru: 'Я собираю роботов в своей мастерской. Помнишь моё имя?', en: 'I build robots in my workshop. Do you remember my name?' },
    role: { ru: 'я собираю роботов', en: 'I build robots' },
  },
];
