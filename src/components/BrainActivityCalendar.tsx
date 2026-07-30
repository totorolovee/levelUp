type Props = {
  activeDates: string[];
  isRussian: boolean;
  streak: number;
};

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function BrainActivityCalendar({ activeDates, isRussian, streak }: Props) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const active = new Set(activeDates);
  const weekdays = isRussian
    ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthTitle = new Intl.DateTimeFormat(isRussian ? 'ru-RU' : 'en-US', {
    month: 'long',
    year: 'numeric',
  }).format(today);

  return (
    <section className="brain-activity-card">
      <header>
        <div>
          <p className="eyebrow">{isRussian ? 'Календарь активности' : 'Activity calendar'}</p>
          <h2>{monthTitle}</h2>
        </div>
        <span>🔥 {streak} {isRussian ? 'дн.' : 'days'}</span>
      </header>
      <div className="activity-calendar">
        {weekdays.map((day) => <small key={day}>{day}</small>)}
        {Array.from({ length: firstWeekday }, (_, index) => <i key={`blank-${index}`} />)}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const date = new Date(year, month, index + 1);
          const isActive = active.has(dateKey(date));
          const isToday = dateKey(date) === dateKey(today);
          return (
            <span className={`${isActive ? 'active ' : ''}${isToday ? 'today' : ''}`} key={dateKey(date)}>
              {index + 1}
            </span>
          );
        })}
      </div>
    </section>
  );
}
