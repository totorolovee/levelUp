import { useEffect, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { SmoothLink } from '../components/SmoothLink';
import { useLanguage } from '../lib/language';
import {
  leagueLevels,
  loadLeagueLeaderboard,
  type LeaguePlayer,
} from '../lib/leagues';

type State =
  | { status: 'loading' }
  | { status: 'guest' | 'error' }
  | { status: 'ready'; current: LeaguePlayer; players: LeaguePlayer[] };

export function LeaguesPage() {
  const { language } = useLanguage();
  const [state, setState] = useState<State>({ status: 'loading' });
  const isRussian = language === 'ru';

  useEffect(() => {
    loadLeagueLeaderboard()
      .then((result) => setState(result
        ? { status: 'ready', current: result.currentPlayer, players: result.players }
        : { status: 'guest' }))
      .catch(() => setState({ status: 'error' }));
  }, []);

  const currentLevel = state.status === 'ready'
    ? leagueLevels.find(({ id }) => id === state.current.league)
    : null;
  const leaguePlayers = state.status === 'ready'
    ? state.players
      .filter(({ league }) => league === state.current.league)
      .sort((first, second) => first.rankPosition - second.rankPosition)
    : [];

  return (
    <main className="shell">
      <AppHeader />
      <section className="page-intro">
        <div>
          <p className="eyebrow">{isRussian ? 'Соревнование по XP' : 'XP competition'}</p>
          <h1>{isRussian ? 'Твоя лига. Твой следующий уровень.' : 'Your league. Your next level.'}</h1>
          <p>
            {isRussian
              ? 'Зарабатывай XP чтением и ежедневной активностью, чтобы подняться выше.'
              : 'Earn XP through reading and daily activity to move up.'}
          </p>
        </div>
      </section>

      {state.status === 'loading' && <p>{isRussian ? 'Загружаю лигу…' : 'Loading league…'}</p>}
      {state.status === 'error' && (
        <p className="coach-error">{isRussian ? 'Не удалось загрузить рейтинг.' : 'Could not load leaderboard.'}</p>
      )}
      {state.status === 'guest' && (
        <section className="empty-state">
          <h2>{isRussian ? 'Войди, чтобы участвовать' : 'Sign in to compete'}</h2>
          <SmoothLink className="primary-link" href="/login">
            {isRussian ? 'Войти' : 'Sign in'}
          </SmoothLink>
        </section>
      )}
      {state.status === 'ready' && currentLevel && (
        <>
          <section className={`league-hero league-${currentLevel.id}`}>
            <span>{currentLevel.icon}</span>
            <div>
              <p>{isRussian ? 'Текущая лига' : 'Current league'}</p>
              <h2>{isRussian ? currentLevel.ru : currentLevel.en}</h2>
            </div>
            <strong>#{state.current.rankPosition}</strong>
          </section>
          <section className="league-table">
            <h2>{isRussian ? 'Таблица участников' : 'Leaderboard'}</h2>
            {leaguePlayers.map((player) => (
              <article className={player.isCurrentUser ? 'current' : ''} key={`${player.rankPosition}-${player.username}`}>
                <b>#{player.rankPosition}</b>
                <span>{player.username}</span>
                <strong>{player.xp} XP</strong>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
