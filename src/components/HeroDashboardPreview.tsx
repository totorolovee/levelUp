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
          <small>Активность</small>
          <div className="preview-bars">
            {[42, 66, 50, 86, 72, 96, 78].map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <strong>7 дней</strong>
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
