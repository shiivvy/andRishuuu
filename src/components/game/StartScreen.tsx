import { Button } from '@/components/ui/button';
import { Play, Volume2, VolumeX } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function StartScreen({ onStart, isMuted, onToggleMute }: StartScreenProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-game-sky-top to-game-sky-bottom z-10">
      <div className="text-center animate-bounce-in">
        <h1 className="font-arcade text-3xl sm:text-4xl text-primary mb-2 text-shadow-glow">
          FLAPPY
        </h1>
        <h1 className="font-arcade text-2xl sm:text-3xl text-secondary mb-8">
          BIRD
        </h1>

        <div className="animate-float mb-10">
          <div className="w-20 h-16 mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg" />
            <div className="absolute top-2 right-3 w-4 h-4 bg-card rounded-full" />
            <div className="absolute top-3 right-3 w-2 h-2 bg-foreground rounded-full" />
            <div className="absolute top-5 -right-2 w-0 h-0 border-l-8 border-l-accent border-y-4 border-y-transparent" />
          </div>
        </div>

        <Button
          onClick={onStart}
          size="lg"
          className="font-arcade text-sm px-8 py-6 animate-pulse-glow hover:scale-105 transition-transform"
        >
          <Play className="w-5 h-5 mr-2" />
          START
        </Button>

        <p className="mt-8 text-muted-foreground font-body text-sm">
          Tap or click to flap!
        </p>
      </div>

      <button
        onClick={onToggleMute}
        className="absolute top-4 right-4 p-3 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Volume2 className="w-5 h-5 text-foreground" />
        )}
      </button>
    </div>
  );
}
