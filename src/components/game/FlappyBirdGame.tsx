import { useState, useCallback, useEffect } from 'react';
import { GameCanvas } from './GameCanvas';
import { StartScreen } from './StartScreen';
import { GameOverScreen } from './GameOverScreen';
import { ScoreDisplay } from './ScoreDisplay';
import { useGameAssets } from '@/hooks/useGameAssets';
import { useGameSounds } from '@/hooks/useGameSounds';
import { useCharacters } from '@/hooks/useCharacters';

type GameState = 'start' | 'playing' | 'gameOver';

export function FlappyBirdGame() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('flappyHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const { assets, handleFileUpload, updateAsset } = useGameAssets();
  const {
    characters,
    selectedCharacter,
    selectedCharacterId,
    selectCharacter,
    updateCharacterImage,
  } = useCharacters();

  // Sync selected character image with game assets
  useEffect(() => {
    updateAsset('birdImage', selectedCharacter.image);
  }, [selectedCharacter.image, updateAsset]);
  const {
    isMuted,
    initAudio,
    playFlap,
    playScore,
    playCollision,
    toggleMute,
  } = useGameSounds();

  const handleStart = useCallback(() => {
    initAudio();
    setGameState('playing');
    setScore(0);
  }, [initAudio]);

  const handleGameOver = useCallback((finalScore: number) => {
    setGameState('gameOver');
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('flappyHighScore', finalScore.toString());
    }
  }, [highScore]);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
  }, []);

  const handleRestart = useCallback(() => {
    setGameState('playing');
    setScore(0);
  }, []);

  const handleUploadBird = useCallback((file: File) => {
    handleFileUpload('birdImage', file);
  }, [handleFileUpload]);

  // Handle keyboard for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        if (gameState === 'start') {
          handleStart();
        } else if (gameState === 'gameOver') {
          handleRestart();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleStart, handleRestart]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative overflow-hidden rounded-2xl">
        <GameCanvas
          isPlaying={gameState === 'playing'}
          onGameOver={handleGameOver}
          onScoreUpdate={handleScoreUpdate}
          assets={assets}
          playFlap={playFlap}
          playScore={playScore}
          playCollision={playCollision}
          selectedCharacter={selectedCharacter}
        />

        {gameState === 'playing' && <ScoreDisplay score={score} />}

        {gameState === 'start' && (
          <StartScreen
            onStart={handleStart}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            characters={characters}
            selectedCharacterId={selectedCharacterId}
            onSelectCharacter={selectCharacter}
            selectedCharacter={selectedCharacter}
          />
        )}

        {gameState === 'gameOver' && (
          <GameOverScreen
            score={score}
            highScore={highScore}
            onRestart={handleRestart}
            onUploadBird={(file) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                const result = e.target?.result as string;
                updateCharacterImage(selectedCharacterId, result);
              };
              reader.readAsDataURL(file);
            }}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            currentBirdImage={selectedCharacter.image}
            selectedCharacter={selectedCharacter}
          />
        )}
      </div>

      <p className="text-center text-muted-foreground text-sm mt-4 font-body">
        Press Space, click, or tap to flap
      </p>
    </div>
  );
}
