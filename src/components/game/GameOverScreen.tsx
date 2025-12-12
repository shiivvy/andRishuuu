import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Upload, Volume2, VolumeX } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onUploadBird: (file: File) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  currentBirdImage: string | null;
}

export function GameOverScreen({
  score,
  highScore,
  onRestart,
  onUploadBird,
  isMuted,
  onToggleMute,
  currentBirdImage,
}: GameOverScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadBird(file);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/60 backdrop-blur-sm z-20">
      <div className="bg-card rounded-3xl p-8 shadow-2xl animate-bounce-in max-w-sm w-full mx-4">
        <h2 className="font-arcade text-2xl text-accent mb-6 text-center animate-shake">
          GAME OVER
        </h2>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center bg-muted rounded-xl px-4 py-3">
            <span className="font-body font-semibold text-muted-foreground">Score</span>
            <span className="font-arcade text-lg text-foreground">{score}</span>
          </div>

          <div className="flex justify-between items-center bg-muted rounded-xl px-4 py-3">
            <span className="font-body font-semibold text-muted-foreground">Best</span>
            <span className="font-arcade text-lg text-primary">{highScore}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onRestart}
            className="w-full font-arcade text-xs py-6 hover:scale-105 transition-transform"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            PLAY AGAIN
          </Button>

          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            className="w-full font-body font-semibold py-5"
          >
            <Upload className="w-4 h-4 mr-2" />
            Change Bird
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {currentBirdImage && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <img
                src={currentBirdImage}
                alt="Current bird"
                className="w-8 h-8 object-contain rounded"
              />
              <span className="font-body">Custom bird active</span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleMute}
          className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Volume2 className="w-4 h-4 text-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}
