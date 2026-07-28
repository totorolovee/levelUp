import { Auth } from '../components/Auth';
import { AppHeader } from '../components/AppHeader';

export function LoginPage() {
  return (
    <main className="shell">
      <AppHeader />
      <section className="page-intro">
        <div>
          <p className="eyebrow">Аккаунт</p>
          <h1>Войди, чтобы сохранить прогресс.</h1>
          <p>После входа выбранные книги и проценты чтения загрузятся автоматически.</p>
        </div>
      </section>
      <Auth />
    </main>
  );
}
