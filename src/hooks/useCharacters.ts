import { useState, useCallback } from 'react';

export interface Character {
  id: string;
  name: string;
  power: string;
  image: string | null; // null means use default avatar
  emoji: string; // fallback emoji if no image
}

const DEFAULT_CHARACTERS: Character[] = [
  {
    id: 'chad',
    name: 'Gigachad Gary',
    power: '💪 Never skips flap day',
    image: null,
    emoji: '😎',
  },
  {
    id: 'karen',
    name: 'Karen the Karen',
    power: '🗣️ Demands to see the pipe manager',
    image: null,
    emoji: '💅',
  },
  {
    id: 'sleepy',
    name: 'Sleepy Steve',
    power: '😴 Falls asleep mid-flight',
    image: null,
    emoji: '🥱',
  },
  {
    id: 'confused',
    name: 'Confused Carl',
    power: '🤔 Which way is up again?',
    image: null,
    emoji: '🙃',
  },
];

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>(DEFAULT_CHARACTERS);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(DEFAULT_CHARACTERS[0].id);

  const selectedCharacter = characters.find(c => c.id === selectedCharacterId) || characters[0];

  const selectCharacter = useCallback((id: string) => {
    setSelectedCharacterId(id);
  }, []);

  const updateCharacterImage = useCallback((id: string, imageDataUrl: string) => {
    setCharacters(prev => prev.map(char => 
      char.id === id ? { ...char, image: imageDataUrl } : char
    ));
  }, []);

  const updateCharacterName = useCallback((id: string, name: string) => {
    setCharacters(prev => prev.map(char => 
      char.id === id ? { ...char, name } : char
    ));
  }, []);

  const updateCharacterPower = useCallback((id: string, power: string) => {
    setCharacters(prev => prev.map(char => 
      char.id === id ? { ...char, power } : char
    ));
  }, []);

  return {
    characters,
    selectedCharacter,
    selectedCharacterId,
    selectCharacter,
    updateCharacterImage,
    updateCharacterName,
    updateCharacterPower,
  };
}
