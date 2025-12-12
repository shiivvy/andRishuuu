import { FlappyBirdGame } from '@/components/game/FlappyBirdGame';

const Index = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-game-sky-top to-game-sky-bottom flex flex-col items-center justify-center p-4">
      <FlappyBirdGame />
    </main>
  );
};

export default Index;
