import { useLanguage } from '../lib/language';
import { Link } from 'wouter';

type Props = {
  isSignedIn: boolean;
};

export function HeroDashboardPreview({ isSignedIn }: Props) {
  const { language } = useLanguage();
  const isRussian = language === 'ru';
  const taskContent = (
    <>
      <small>{isSignedIn
        ? (isRussian ? 'Сегодняшние задачи' : "Today's tasks")
        : (isRussian ? 'Задачи' : 'Tasks')}</small>
      <div className="preview-tasks">
        <p><i /><span>{isRussian ? 'Создай первую задачу' : 'Create your first task'}</span></p>
        <p><i /><span>{isRussian ? 'Раздели дела по темам' : 'Sort tasks into topics'}</span></p>
        <p><i /><span>{isRussian ? 'Отмечай выполненное' : 'Tick off completed tasks'}</span></p>
      </div>
      <strong>{isRussian ? 'Твой список ждёт' : 'Your list is waiting'}</strong>
    </>
  );

  return (
    <div className="hero-dashboard-preview" aria-hidden={isSignedIn ? undefined : true}>
      <div className="preview-topline">
        <span>
          {isSignedIn
            ? (isRussian ? 'ОБЗОР УРОВНЯ' : 'LEVEL OVERVIEW')
            : (isRussian ? 'НАЧНИ СВОЙ ПУТЬ' : 'START YOUR JOURNEY')}
        </span>
        <i />
      </div>
      <div className="preview-highlight">
        <div>
          <small>
            {isSignedIn
              ? (isRussian ? 'Сегодняшний прогресс' : "Today's progress")
              : (isRussian ? 'Личная система развития' : 'Personal growth system')}
          </small>
          <strong>
            {isSignedIn ? '74%' : 'LevelUp'}
          </strong>
          <p>
            {isSignedIn
              ? (isRussian ? 'Ещё один шаг до нового уровня' : 'One more step toward a new level')
              : (isRussian ? 'Цели, привычки и прогресс в одном пространстве' : 'Goals, habits, and progress in one place')}
          </p>
        </div>
        <div className="preview-orb"><span>L</span></div>
      </div>
      <div className="preview-widgets">
        {isSignedIn
          ? <Link className="preview-task-link" href="/todos">{taskContent}</Link>
          : <article>{taskContent}</article>}
        <article>
          <small>{isRussian ? 'Путь развития' : 'Growth path'}</small>
          <strong className="preview-xp">
            {isSignedIn ? '2 480' : '0—4000 XP'}
          </strong>
          <div className="preview-line"><i /></div>
          <p>
            {isSignedIn
              ? (isRussian ? '+320 XP за неделю' : '+320 XP this week')
              : (isRussian ? 'Уровни, ранги и достижения' : 'Levels, ranks, and achievements')}
          </p>
        </article>
      </div>
    </div>
  );
}
