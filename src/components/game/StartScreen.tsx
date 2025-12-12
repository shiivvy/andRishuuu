import { Button } from '@/components/ui/button';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { CharacterSelector } from './CharacterSelector';
import { Character } from '@/hooks/useCharacters';

interface StartScreenProps {
  onStart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  characters: Character[];
  selectedCharacterId: string;
  onSelectCharacter: (id: string) => void;
  selectedCharacter: Character;
}

export function StartScreen({ 
  onStart, 
  isMuted, 
  onToggleMute,
  characters,
  selectedCharacterId,
  onSelectCharacter,
  selectedCharacter,
}: StartScreenProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-game-sky-top to-game-sky-bottom z-10 p-4">
      <div className="text-center animate-bounce-in w-full max-w-xs">
        <h1 className="font-arcade text-2xl sm:text-3xl text-primary mb-1 text-shadow-glow">
          FLAPPY
        </h1>
        <h1 className="font-arcade text-xl sm:text-2xl text-secondary mb-4">
          FACES
        </h1>

        {/* Selected Character Preview */}
        <div className="animate-float mb-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden border-4 border-card shadow-lg">
            {selectedCharacter.image ? (
              <img 
                src={selectedCharacter.image} 
                alt={selectedCharacter.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl">{selectedCharacter.emoji}</span>
            )}
          </div>
          <p className="font-arcade text-[8px] text-foreground mt-2">{selectedCharacter.name}</p>
          <p className="text-[10px] text-muted-foreground">{selectedCharacter.power}</p>
        </div>

        {/* Character Selector */}
        <div className="mb-4">
          <CharacterSelector
            characters={characters}
            selectedCharacterId={selectedCharacterId}
            onSelectCharacter={onSelectCharacter}
          />
        </div>

        <Button
          onClick={onStart}
          size="lg"
          className="font-arcade text-xs px-6 py-4 animate-pulse-glow hover:scale-105 transition-transform"
        >
          <Play className="w-4 h-4 mr-2" />
          START
        </Button>

        <p className="mt-4 text-muted-foreground font-body text-xs">
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
