interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
      <div className="font-arcade text-4xl sm:text-5xl text-card text-shadow-glow drop-shadow-lg">
        {score}
      </div>
    </div>
  );
}
