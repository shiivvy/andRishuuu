import { Character } from '@/hooks/useCharacters';
import { CharacterCard } from './CharacterCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface CharacterSelectorProps {
  characters: Character[];
  selectedCharacterId: string;
  onSelectCharacter: (id: string) => void;
}

export function CharacterSelector({ 
  characters, 
  selectedCharacterId, 
  onSelectCharacter 
}: CharacterSelectorProps) {
  const [currentIndex, setCurrentIndex] = useState(() => 
    characters.findIndex(c => c.id === selectedCharacterId) || 0
  );

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? characters.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onSelectCharacter(characters[newIndex].id);
  };

  const goToNext = () => {
    const newIndex = currentIndex === characters.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    onSelectCharacter(characters[newIndex].id);
  };

  const currentCharacter = characters[currentIndex];

  return (
    <div className="w-full">
      <p className="font-arcade text-[10px] text-muted-foreground text-center mb-2">
        CHOOSE YOUR FIGHTER
      </p>
      
      {/* Main character display with arrows */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={goToPrevious}
          className="p-2 rounded-full bg-card/50 hover:bg-card/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>

        <div className="flex-1 flex justify-center">
          <CharacterCard
            character={currentCharacter}
            isSelected={true}
            onSelect={() => {}}
            size="lg"
          />
        </div>

        <button
          onClick={goToNext}
          className="p-2 rounded-full bg-card/50 hover:bg-card/80 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Character dots indicator */}
      <div className="flex justify-center gap-1 mt-2">
        {characters.map((char, index) => (
          <button
            key={char.id}
            onClick={() => {
              setCurrentIndex(index);
              onSelectCharacter(char.id);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-primary scale-125' 
                : 'bg-muted-foreground/50 hover:bg-muted-foreground'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
