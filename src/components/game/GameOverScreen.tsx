import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Upload, Volume2, VolumeX } from 'lucide-react';
import { Character } from '@/hooks/useCharacters';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onUploadBird: (file: File) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  currentBirdImage: string | null;
  selectedCharacter: Character;
}

export function GameOverScreen({
  score,
  highScore,
  onRestart,
  onUploadBird,
  isMuted,
  onToggleMute,
  currentBirdImage,
  selectedCharacter,
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
      <div className="bg-card rounded-3xl p-6 shadow-2xl animate-bounce-in max-w-sm w-full mx-4">
        <h2 className="font-arcade text-xl text-accent mb-4 text-center animate-shake">
          GAME OVER
        </h2>

        {/* Selected Character Display */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden border-3 border-card shadow-lg">
            {selectedCharacter.image ? (
              <img 
                src={selectedCharacter.image} 
                alt={selectedCharacter.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">{selectedCharacter.emoji}</span>
            )}
          </div>
          <p className="font-arcade text-[8px] text-foreground mt-2">{selectedCharacter.name}</p>
          <p className="text-[9px] text-muted-foreground">{selectedCharacter.power}</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center bg-muted rounded-xl px-4 py-2">
            <span className="font-body font-semibold text-muted-foreground text-sm">Score</span>
            <span className="font-arcade text-base text-foreground">{score}</span>
          </div>

          <div className="flex justify-between items-center bg-muted rounded-xl px-4 py-2">
            <span className="font-body font-semibold text-muted-foreground text-sm">Best</span>
            <span className="font-arcade text-base text-primary">{highScore}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={onRestart}
            className="w-full font-arcade text-xs py-5 hover:scale-105 transition-transform"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            PLAY AGAIN
          </Button>

          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            className="w-full font-body font-semibold py-4 text-sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Custom Face for {selectedCharacter.name.split(' ')[0]}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
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
