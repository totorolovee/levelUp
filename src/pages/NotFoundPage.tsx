import { SmoothLink } from '../components/SmoothLink';

export function NotFoundPage() {
  return (
    <main className="container">
      <section className="hello">
        <h1>Такой страницы пока нет</h1>
        <p>
          <SmoothLink href="/">Вернуться на главную</SmoothLink>
        </p>
      </section>
    </main>
  );
}
