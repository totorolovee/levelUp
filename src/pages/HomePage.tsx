import { useEffect, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { SectionCard } from '../components/SectionCard';
import { SmoothLink } from '../components/SmoothLink';
import { HeroDashboardPreview } from '../components/HeroDashboardPreview';
import { useLanguage } from '../lib/language';
import { supabase } from '../lib/supabase';

export function HomePage() {
  const { language } = useLanguage();
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [areSectionsVisible, setAreSectionsVisible] = useState(false);
  const today = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setIsSignedIn(Boolean(data.session));
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const hasSession = Boolean(session);
      setIsSignedIn(hasSession);
      if (!hasSession) setAreSectionsVisible(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

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
    <main className="shell home-shell">
      <AppHeader />
      <section className={isTransitioning ? 'title-screen leaving' : 'title-screen'}>
        <div className="title-content">
          <p className="eyebrow">Твоя жизнь. Только на уровень выше.</p>
          <h1>
            LevelUp <span>AI</span>
          </h1>
          <p className="title-copy">
            Ставь цели, читай, учись принимать умные решения и каждый день
            становись немного лучше.
          </p>
          {isSignedIn && (
            <button className="scroll-link" onClick={revealSections} type="button">
              Выбрать направление ↓
            </button>
          )}
          {isSignedIn === false && (
            <SmoothLink className="primary-link guest-login" href="/login">
              Войти
            </SmoothLink>
          )}
        </div>
        <HeroDashboardPreview isSignedIn={isSignedIn === true} />
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
              accent="#8b70ef"
              description="Работа, учёба и личные задачи в одном месте"
              href="/todos"
              icon="✓"
              title={language === 'ru' ? 'Поставь галочку' : 'Tick the box'}
            />
            <SectionCard
              accent="#7559ff"
              description="Большие цели и маленькие ежедневные шаги"
              href="/goals"
              icon="◎"
              title="Goals"
            />
            <SectionCard
              accent="#a45cff"
              description="Запоминай главные идеи из прочитанного"
              href="/reading"
              icon="▤"
              title="Reading"
            />
            <SectionCard
              accent="#2d8cff"
              description="Выбирай направление, страну и подходящий университет"
              href="/universities"
              icon="◇"
              title="Universities"
            />
            <SectionCard
              accent="#27c2f3"
              description="Виртуальный портфель и журнал решений"
              href="/investing"
              icon="↗"
              title="Investing"
            />
            <SectionCard
              accent="#e65fb7"
              description="Понимай свои эмоции, энергию и привычки"
              href="/reflection"
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
