export function GoalRoadmap({ milestones }: { milestones: string[] }) {
  return (
    <section className="goal-roadmap">
      <p className="eyebrow">Дорожная карта</p>
      <h2>От мечты до результата</h2>
      <ol>
        {milestones.map((milestone, index) => (
          <li key={milestone}>
            <span>{index + 1}</span>
            <p>{milestone}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
