export function HeroDashboardPreview() {
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
          <small>Tick the box</small>
          <div className="preview-tasks">
            <p><i>✓</i><span>Повторить SAT</span></p>
            <p><i /><span>Закончить проект</span></p>
            <p><i /><span>Тренировка</span></p>
          </div>
          <strong>1 из 3 готово</strong>
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
