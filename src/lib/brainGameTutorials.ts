import type { BrainGameId } from './brainGameCatalog';
import type { BrainGameCategory } from './brainGameResults';
import { getBrainGameDescription } from './brainGameDescriptions';

const controls: Record<BrainGameId, { ru: string; en: string }> = {
  shade: { ru: 'Нажми на единственную фигуру, оттенок которой отличается.', en: 'Tap the one shape whose shade is different.' },
  scan: { ru: 'Нажми на каждую фигуру-цель и не отмечай отвлекающие символы.', en: 'Tap every target shape and avoid the distractors.' },
  switch: { ru: 'Сначала прочитай правило: отвечай по цвету чернил или по значению слова.', en: 'Read the rule first: answer by ink color or word meaning.' },
  coffee: { ru: 'Выбери стакан, повтори кубики сахара или капли сиропа, запусти красной кнопкой и останови зелёной, когда стакан полный.', en: 'Choose a cup, match its sugar cubes or syrup drops, start with red, and stop with green when the cup is full.' },
  count: { ru: 'Просканируй поле по строкам, посчитай цель и выбери число.', en: 'Scan row by row, count the target, and choose the number.' },
  'focus-match': { ru: 'Сравни две фигуры и выбери «Да» или «Нет».', en: 'Compare the two shapes and choose Yes or No.' },
  reaction: { ru: 'Не нажимай заранее. Коснись кнопки только после зелёного сигнала.', en: 'Do not tap early. Touch the button only after the green signal.' },
  compare: { ru: 'Нажми на большее число как можно быстрее.', en: 'Tap the larger number as quickly as possible.' },
  math: { ru: 'Проверь сумму и ответь, верно ли равенство.', en: 'Check the sum and decide whether the equation is correct.' },
  direction: { ru: 'Нажми кнопку с тем же направлением, что у большой стрелки.', en: 'Tap the button matching the large arrow’s direction.' },
  sort: { ru: 'Следуй текущему правилу: чётность или сравнение с 50.', en: 'Follow the current rule: parity or comparison with 50.' },
  sequence: { ru: 'После исчезновения цифр введи последовательность в том же порядке.', en: 'After the digits disappear, enter them in the same order.' },
  pairs: { ru: 'Открывай по две карточки и запоминай позиции несовпавших символов.', en: 'Reveal two cards at a time and remember unmatched positions.' },
  pattern: { ru: 'Запомни светлые клетки, затем отметь только эти позиции.', en: 'Remember the bright cells, then select only those positions.' },
  missing: { ru: 'Запомни предметы и выбери тот, который исчез.', en: 'Remember the objects and choose the one that disappeared.' },
  reverse: { ru: 'После показа введи все цифры в обратном порядке.', en: 'After the reveal, enter every digit in reverse order.' },
  'growing-matrix': { ru: 'С каждым раундом запоминай на одну позицию больше.', en: 'Remember one additional position in every round.' },
  'face-name': { ru: 'Познакомься с людьми и прочитай их истории. Затем напечатай имя по лицу и подсказке.', en: 'Meet the people and read their stories. Then type each name from the face and clue.' },
  'number-pattern': { ru: 'Найди шаг последовательности и выбери следующее число.', en: 'Find the sequence step and choose the next number.' },
  'target-equation': { ru: 'Подставь знак +, − или ×, чтобы получить показанный результат.', en: 'Insert +, −, or × to produce the shown result.' },
  'odd-rule': { ru: 'Определи общее правило и нажми на число-исключение.', en: 'Identify the shared rule and tap the exception.' },
  'path-planner': { ru: 'Сначала продумай путь, затем веди точку стрелками к цели.', en: 'Plan first, then guide the dot to the target with arrows.' },
  rotation: { ru: 'Представь поворот стрелки и выбери совпадающее направление.', en: 'Visualize the rotation and choose the matching direction.' },
  'greater-expression': { ru: 'Вычисли оба произведения и нажми на большее.', en: 'Calculate both products and tap the greater one.' },
  multiplication: { ru: 'Реши пример в уме и выбери правильный результат.', en: 'Solve the multiplication mentally and choose the result.' },
  'number-path': { ru: 'Примени показанный шаг и выбери следующий блок.', en: 'Apply the shown step and choose the next block.' },
  fractions: { ru: 'Сравни значения дробей и нажми на большую.', en: 'Compare the fraction values and tap the greater one.' },
  'missing-number': { ru: 'Найди постоянный шаг и восстанови пропущенное число.', en: 'Find the constant step and restore the missing number.' },
};

export function getBrainGameTutorial(id: BrainGameId, category: BrainGameCategory) {
  const action = getBrainGameDescription(id, category).action;
  const mistakeRule = id === 'face-name'
    ? {
        ru: 'Чтобы перейти дальше, вспомни все имена без единой ошибки. Каждый новый уровень добавляет ещё одно лицо.',
        en: 'Recall every name without a single mistake to advance. Each new level adds one more face.',
      }
    : id === 'coffee'
      ? {
          ru: 'Перелитый или испорченный стакан выброси в корзину слева. Каждые 15 секунд появляется ещё один заказ — максимум четыре.',
          en: 'Throw an overflowed or incorrect cup in the bin on the left. Another order appears every 15 seconds, up to four.',
        }
    : {
        ru: 'При ошибке уровень не изменится: прочитай подсказку и попробуй тот же вопрос снова.',
        en: 'A mistake will not change the level: read the hint and retry the same question.',
      };
  return [
    { ru: 'Пойми цель', en: 'Understand the goal', copy: action },
    { ru: 'Сделай ход', en: 'Make your move', copy: controls[id] },
    {
      ru: 'Учись на ошибке',
      en: 'Learn from mistakes',
      copy: mistakeRule,
    },
  ];
}
