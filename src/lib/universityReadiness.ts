import { getIeltsReadiness, getIeltsTarget } from './ieltsTargets';
import type {
  ReadinessItem,
  StudentProfile,
  University,
} from './universities';

export function assessReadiness(
  university: University,
  profile: StudentProfile,
  language: 'ru' | 'en' = 'ru',
): ReadinessItem[] {
  const items: ReadinessItem[] = [];
  const isRussian = language === 'ru';

  if (university.testPolicy === 'required') {
    items.push({
      label: 'SAT / ACT',
      detail: profile.hasSatOrAct
        ? isRussian ? 'Результат уже есть.' : 'Your result is ready.'
        : isRussian ? 'Нужно запланировать подготовку и сдачу.' : 'Plan your preparation and test date.',
      status: profile.hasSatOrAct ? 'ready' : 'attention',
      points: profile.hasSatOrAct ? 25 : 0,
    });
  } else if (university.testPolicy === 'not-considered') {
    items.push({
      label: 'SAT / ACT',
      detail: isRussian ? 'Не учитывается при поступлении.' : 'Not considered for admission.',
      status: 'optional',
      points: 0,
    });
  } else {
    items.push({
      label: isRussian ? 'Вступительный тест' : 'Admission test',
      detail: isRussian
        ? university.testNote ?? 'Зависит от программы — проверь страницу курса.'
        : 'Requirements depend on the program. Check its official page.',
      status: 'optional',
      points: 0,
    });
  }

  const ieltsTarget = getIeltsTarget(university.id);
  const readiness = getIeltsReadiness(Number(profile.ielts), ieltsTarget);
  items.push({
    label: isRussian ? `IELTS: нужен ${ieltsTarget.toFixed(1)}` : `IELTS target: ${ieltsTarget.toFixed(1)}`,
    detail: getIeltsDetail(profile.ielts, ieltsTarget, readiness, isRussian),
    status: readiness >= 90 ? 'ready' : 'attention',
    points: readiness * 0.25,
  });

  items.push({
    label: isRussian ? 'Эссе' : 'Essay',
    detail: profile.hasEssayDraft
      ? isRussian ? 'Черновик уже начат.' : 'Your draft is underway.'
      : isRussian ? 'Начни с истории о себе и своей мотивации.' : 'Start with your story and motivation.',
    status: profile.hasEssayDraft ? 'ready' : 'attention',
    points: profile.hasEssayDraft ? 25 : 0,
  });
  items.push({
    label: isRussian ? 'Рекомендации' : 'Recommendations',
    detail: profile.hasRecommendations
      ? isRussian ? 'Учителя выбраны.' : 'Your teachers are selected.'
      : isRussian ? 'Выбери учителей и предупреди их заранее.' : 'Choose teachers and ask them early.',
    status: profile.hasRecommendations ? 'ready' : 'attention',
    points: profile.hasRecommendations ? 25 : 0,
  });
  return items;
}

function getIeltsDetail(
  score: string,
  target: number,
  readiness: number,
  isRussian: boolean,
) {
  if (score) {
    return isRussian
      ? `Твой IELTS ${score}: готовность к IELTS — ${readiness}%.`
      : `Your IELTS is ${score}: IELTS readiness is ${readiness}%.`;
  }
  return isRussian
    ? `Введи результат. Ориентир для этого вуза — ${target.toFixed(1)}.`
    : `Enter your result. This university’s target is ${target.toFixed(1)}.`;
}
