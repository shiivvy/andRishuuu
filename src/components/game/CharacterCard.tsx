import { Character } from '@/hooks/useCharacters';
import { cn } from '@/lib/utils';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onSelect: () => void;
  size?: 'sm' | 'lg';
}

export function CharacterCard({ character, isSelected, onSelect, size = 'sm' }: CharacterCardProps) {
  const isLarge = size === 'lg';
  
  return (
    <button
      onClick={onSelect}
      className={cn(
        'relative flex flex-col items-center p-2 rounded-xl transition-all duration-200',
        'hover:scale-105 active:scale-95',
        isSelected 
          ? 'bg-primary/30 ring-2 ring-primary shadow-lg' 
          : 'bg-card/50 hover:bg-card/70',
        isLarge ? 'p-4' : 'p-2'
      )}
    >
      {/* Character Avatar */}
      <div 
        className={cn(
          'rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden border-2',
          isSelected ? 'border-primary' : 'border-card',
          isLarge ? 'w-16 h-16 text-3xl' : 'w-12 h-12 text-2xl'
        )}
      >
        {character.image ? (
          <img 
            src={character.image} 
            alt={character.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="animate-bounce">{character.emoji}</span>
        )}
      </div>

      {/* Character Name */}
      <p className={cn(
        'font-arcade text-foreground mt-1 text-center leading-tight',
        isLarge ? 'text-[8px]' : 'text-[6px]'
      )}>
        {character.name}
      </p>

      {/* Character Power */}
      <p className={cn(
        'text-muted-foreground text-center leading-tight',
        isLarge ? 'text-[10px] mt-1' : 'text-[8px]'
      )}>
        {character.power}
      </p>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
          <span className="text-[10px]">✓</span>
        </div>
      )}
    </button>
  );
}
