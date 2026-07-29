import { useLanguage } from '../lib/language';

type Props = {
  isSignedIn: boolean;
};

export function HeroDashboardPreview({ isSignedIn }: Props) {
  const { language } = useLanguage();
  const isRussian = language === 'ru';

  return (
    <div className="hero-dashboard-preview" aria-hidden="true">
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
              : (isRussian ? 'Твой личный прогресс' : 'Your personal progress')}
          </small>
          <strong>
            {isSignedIn ? '74%' : (isRussian ? 'Начни' : 'Start')}
          </strong>
          <p>
            {isSignedIn
              ? (isRussian ? 'Ещё один шаг до нового уровня' : 'One more step toward a new level')
              : (isRussian ? 'Войди, чтобы сохранять достижения' : 'Sign in to save your achievements')}
          </p>
        </div>
        <div className="preview-orb"><span>L</span></div>
      </div>
      <div className="preview-widgets">
        <article>
          <small>{isRussian ? 'Поставь галочку' : 'Tick the box'}</small>
          <div className="preview-tasks">
            <p><i /><span>{isRussian ? 'Создай первую задачу' : 'Create your first task'}</span></p>
            <p><i /><span>{isRussian ? 'Раздели дела по темам' : 'Sort tasks into topics'}</span></p>
            <p><i /><span>{isRussian ? 'Отмечай выполненное' : 'Tick off completed tasks'}</span></p>
          </div>
          <strong>{isRussian ? 'Твой список ждёт' : 'Your list is waiting'}</strong>
        </article>
        <article>
          <small>{isRussian ? 'Опыт и ранги' : 'XP and ranks'}</small>
          <strong className="preview-xp">
            {isSignedIn ? '2 480' : (isRussian ? 'После входа' : 'After sign-in')}
          </strong>
          <div className="preview-line"><i /></div>
          <p>
            {isSignedIn
              ? (isRussian ? '+320 XP за неделю' : '+320 XP this week')
              : (isRussian ? 'Выполняй задачи и получай XP' : 'Complete tasks and earn XP')}
          </p>
        </article>
      </div>
    </div>
  );
}
