import { useRef, useCallback, useEffect, useState } from 'react';

export function useGameSounds() {
  const [isMuted, setIsMuted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setIsInitialized(true);
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
    if (isMuted || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [isMuted]);

  const playFlap = useCallback(() => {
    playTone(400, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(500, 0.08, 'sine', 0.15), 50);
  }, [playTone]);

  const playScore = useCallback(() => {
    playTone(523, 0.1, 'sine', 0.25);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.25), 100);
    setTimeout(() => playTone(784, 0.15, 'sine', 0.25), 200);
  }, [playTone]);

  const playCollision = useCallback(() => {
    playTone(200, 0.2, 'sawtooth', 0.3);
    setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.25), 100);
  }, [playTone]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    isMuted,
    isInitialized,
    initAudio,
    playFlap,
    playScore,
    playCollision,
    toggleMute,
  };
}
