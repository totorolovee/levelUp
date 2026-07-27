type ReadingExperienceProps = {
  experience: number;
  booksCount: number;
};

export function ReadingExperience({
  experience,
  booksCount,
}: ReadingExperienceProps) {
  const level = Math.floor(experience / 100) + 1;
  const levelProgress = experience % 100;

  return (
    <section className="reading-experience">
      <div className="reader-level">LVL {level}</div>
      <div>
        <div className="experience-heading">
          <div>
            <span>Уровень читателя</span>
            <strong>{experience} XP</strong>
          </div>
          <small>{booksCount} книг выбрано</small>
        </div>
        <div className="experience-track">
          <span style={{ width: `${levelProgress}%` }} />
        </div>
        <p>Читай дальше — каждые 100 XP повышают твой уровень.</p>
      </div>
    </section>
  );
}
