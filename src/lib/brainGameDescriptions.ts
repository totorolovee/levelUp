import type { BrainGameId } from '../components/BrainGameLibrary';
import type { BrainGameCategory } from './brainGameResults';

const actions: Record<BrainGameId, { ru: string; en: string }> = {
  shade: { ru: 'Находи фигуру с другим оттенком, пока цвета постепенно становятся почти одинаковыми.', en: 'Find the shape with a different shade as the colors gradually become nearly identical.' },
  scan: { ru: 'Просматривай растущее поле и отмечай все фигуры, совпадающие с целью.', en: 'Scan a growing field and mark every shape that matches the target.' },
  switch: { ru: 'Быстро переключайся между цветом текста и значением написанного слова.', en: 'Switch quickly between the ink color and the meaning of the written word.' },
  count: { ru: 'Считай нужные символы среди множества похожих отвлекающих фигур.', en: 'Count target symbols among many similar distracting shapes.' },
  'focus-match': { ru: 'Сравнивай пары фигур и мгновенно решай, совпадают ли они.', en: 'Compare pairs of shapes and decide instantly whether they match.' },
  reaction: { ru: 'Дожидайся сигнала и нажимай как можно быстрее, не торопясь раньше времени.', en: 'Wait for the signal and react as quickly as possible without tapping early.' },
  compare: { ru: 'На скорость выбирай большее из двух чисел.', en: 'Choose the larger of two numbers as quickly as possible.' },
  math: { ru: 'Проверяй короткие примеры и быстро решай, верен ли ответ.', en: 'Check short equations and quickly decide whether the answer is correct.' },
  direction: { ru: 'Распознавай направление стрелки и отвечай подходящей кнопкой.', en: 'Recognize the arrow direction and respond with the matching button.' },
  sort: { ru: 'Меняй правила и сортируй числа по чётности или размеру.', en: 'Switch rules and sort numbers by parity or size.' },
  sequence: { ru: 'Запоминай всё более длинные последовательности цифр и восстанавливай их.', en: 'Remember increasingly long digit sequences and reproduce them.' },
  pairs: { ru: 'Открывай карточки и находи одинаковые пары за минимальное число ходов.', en: 'Reveal cards and match identical pairs in as few moves as possible.' },
  pattern: { ru: 'Запоминай расположение светлых клеток и повторяй рисунок.', en: 'Remember the highlighted cells and recreate the pattern.' },
  missing: { ru: 'Запоминай набор предметов и определяй, какой из них исчез.', en: 'Remember a set of objects and identify which one disappeared.' },
  reverse: { ru: 'Удерживай цифры в памяти и вводи последовательность в обратном порядке.', en: 'Hold digits in memory and enter the sequence in reverse order.' },
  'growing-matrix': { ru: 'Запоминай всё больше позиций на матрице за ограниченное время.', en: 'Remember an increasing number of positions on a grid under time pressure.' },
  'number-pattern': { ru: 'Находи правило числового ряда и выбирай следующее значение.', en: 'Discover the number pattern and choose the next value.' },
  'target-equation': { ru: 'Определяй, какой математический знак превращает выражение в верное.', en: 'Identify which operator makes the equation correct.' },
  'odd-rule': { ru: 'Находи число, которое нарушает общее правило группы.', en: 'Find the number that breaks the group’s shared rule.' },
  'path-planner': { ru: 'Планируй кратчайший маршрут от старта до цели.', en: 'Plan the shortest route from the start to the target.' },
  rotation: { ru: 'Мысленно поворачивай фигуру и выбирай совпадающее направление.', en: 'Rotate the shape mentally and choose the matching direction.' },
  'greater-expression': { ru: 'Вычисляй два выражения и на скорость выбирай большее значение.', en: 'Evaluate two expressions and quickly choose the greater value.' },
  multiplication: { ru: 'Решай примеры на умножение, которые становятся сложнее с каждым уровнем.', en: 'Solve multiplication problems that become harder at each level.' },
  'number-path': { ru: 'Продолжай числовой путь, выбирая правильный следующий блок.', en: 'Continue the number path by choosing the correct next block.' },
  fractions: { ru: 'Сравнивай две дроби без калькулятора и выбирай большую.', en: 'Compare two fractions without a calculator and choose the larger one.' },
  'missing-number': { ru: 'Восстанавливай пропущенное значение в числовой последовательности.', en: 'Restore the missing value in a number sequence.' },
};

const skills: Record<BrainGameCategory, { ru: string; en: string }> = {
  attention: {
    ru: 'Внимание помогает удерживать цель, замечать детали и работать с несколькими источниками информации одновременно.',
    en: 'Attention helps you maintain focus, notice details, and handle multiple sources of information at once.',
  },
  speed: {
    ru: 'Скорость обработки — это способность быстро понять информацию и выбрать правильное действие.',
    en: 'Processing speed is the ability to understand information quickly and select the right response.',
  },
  memory: {
    ru: 'Рабочая память позволяет ненадолго удерживать информацию и использовать её прямо во время задачи.',
    en: 'Working memory lets you hold information briefly and use it while completing a task.',
  },
  logic: {
    ru: 'Логическое мышление помогает замечать правила, планировать шаги и находить решение новой задачи.',
    en: 'Logical reasoning helps you detect rules, plan steps, and solve unfamiliar problems.',
  },
  math: {
    ru: 'Числовое мышление помогает уверенно работать с количествами, операциями и закономерностями.',
    en: 'Numerical reasoning helps you work confidently with quantities, operations, and patterns.',
  },
};

export function getBrainGameDescription(id: BrainGameId, category: BrainGameCategory) {
  return { action: actions[id], skill: skills[category] };
}
