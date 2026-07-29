import { useLanguage } from '../lib/language';

export function HeroDashboardPreview() {
  const { language } = useLanguage();
  const isRussian = language === 'ru';

  return (
    <div className="hero-dashboard-preview" aria-hidden="true">
      <div className="preview-topline">
        <span>LEVEL OVERVIEW</span>
        <i />
      </div>
      <div className="preview-highlight">
        <div>
          <small>Сегодняшний прогресс</small>
          <strong>74%</strong>
          <p>Ещё один шаг до нового уровня</p>
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
          <small>Опыт</small>
          <strong className="preview-xp">2 480</strong>
          <div className="preview-line"><i /></div>
          <p>+320 XP за неделю</p>
        </article>
      </div>
    </div>
  );
}
