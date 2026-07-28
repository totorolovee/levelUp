import { useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { SectionCard } from '../components/SectionCard';

export function HomePage() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [areSectionsVisible, setAreSectionsVisible] = useState(false);
  const today = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  const revealSections = () => {
    setIsTransitioning(true);
    window.setTimeout(() => {
      setAreSectionsVisible(true);
      window.requestAnimationFrame(() => {
        document.querySelector('#sections')?.scrollIntoView({ behavior: 'smooth' });
        window.setTimeout(() => setIsTransitioning(false), 600);
      });
    }, 220);
  };

  return (
    <main className="shell">
      <AppHeader />
      <section className={isTransitioning ? 'title-screen leaving' : 'title-screen'}>
        <div className="title-mark">L</div>
        <div className="title-content">
          <p className="eyebrow">Твоя жизнь. Только на уровень выше.</p>
          <h1>
            LevelUp <span>AI</span>
          </h1>
          <p className="title-copy">
            Ставь цели, читай, учись принимать умные решения и каждый день
            становись немного лучше.
          </p>
          <button className="scroll-link" onClick={revealSections} type="button">
            Выбрать направление ↓
          </button>
        </div>
        <div className="title-footer">
          <span>Создано</span>
          <strong>Kassenov Alimzhan</strong>
        </div>
      </section>

      {areSectionsVisible && (
        <div className="sections-reveal">
          <section className="dashboard-intro" id="sections">
            <div>
              <p className="eyebrow">{today}</p>
              <h2>Куда прокачаемся сегодня?</h2>
              <p>Выбери один режим. Остальное подождёт.</p>
            </div>
            <div className="level-pill">
              <span>Твой уровень</span>
              <strong>Level 1</strong>
            </div>
          </section>
          <section className="section-grid" aria-label="Разделы приложения">
            <SectionCard
              accent="#dfeee4"
              description="Большие цели и маленькие ежедневные шаги"
              href="/goals"
              icon="◎"
              title="Goals"
            />
            <SectionCard
              accent="#eee8d8"
              description="Запоминай главные идеи из прочитанного"
              href="/reading"
              icon="▤"
              title="Reading"
            />
            <SectionCard
              accent="#dce8ed"
              description="Виртуальный портфель и журнал решений"
              href="/investing"
              icon="↗"
              title="Investing"
            />
            <SectionCard
              accent="#eee1e1"
              description="Понимай свои эмоции, энергию и привычки"
              icon="♡"
              title="Reflection"
            />
          </section>
          <aside className="daily-note">
            <span>Мысль дня</span>
            <p>Не пытайся стать лучше во всём сразу. Выбери один важный шаг.</p>
          </aside>
        </div>
      )}
    </main>
  );
}
