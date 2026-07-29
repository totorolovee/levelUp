export function TaskConfetti({ run }: { run: number }) {
  if (!run) return null;
  return (
    <div className="task-confetti" aria-hidden="true" key={run}>
      {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
    </div>
  );
}
