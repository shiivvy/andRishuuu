import { useRef, useEffect, useCallback } from 'react';
import { GameAssets } from '@/hooks/useGameAssets';

interface GameCanvasProps {
  isPlaying: boolean;
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
  assets: GameAssets;
  playFlap: () => void;
  playScore: () => void;
  playCollision: () => void;
}

interface Bird {
  x: number;
  y: number;
  velocity: number;
  width: number;
  height: number;
  rotation: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  width: number;
  gap: number;
  passed: boolean;
}

const GRAVITY = 0.4;
const FLAP_FORCE = -7;
const PIPE_SPEED = 3;
const PIPE_SPAWN_INTERVAL = 2000;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const GROUND_HEIGHT = 80;

export function GameCanvas({
  isPlaying,
  onGameOver,
  onScoreUpdate,
  assets,
  playFlap,
  playScore,
  playCollision,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const birdRef = useRef<Bird>({
    x: 100,
    y: 200,
    velocity: 0,
    width: 40,
    height: 30,
    rotation: 0,
  });
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const lastPipeSpawnRef = useRef(0);
  const groundOffsetRef = useRef(0);
  const birdImageRef = useRef<HTMLImageElement | null>(null);

  // Load bird image when asset changes
  useEffect(() => {
    if (assets.birdImage) {
      const img = new Image();
      img.onload = () => {
        birdImageRef.current = img;
      };
      img.src = assets.birdImage;
    } else {
      birdImageRef.current = null;
    }
  }, [assets.birdImage]);

  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    birdRef.current = {
      x: 100,
      y: canvas.height / 2 - GROUND_HEIGHT / 2,
      velocity: 0,
      width: 40,
      height: 30,
      rotation: 0,
    };
    pipesRef.current = [];
    scoreRef.current = 0;
    lastPipeSpawnRef.current = 0;
    groundOffsetRef.current = 0;
    onScoreUpdate(0);
  }, [onScoreUpdate]);

  const flap = useCallback(() => {
    if (!isPlaying) return;
    birdRef.current.velocity = FLAP_FORCE;
    playFlap();
  }, [isPlaying, playFlap]);

  const checkCollision = useCallback((bird: Bird, pipes: Pipe[], canvasHeight: number): boolean => {
    // Centroid-based collision - only check the center point of the bird
    const centerX = bird.x + bird.width / 2;
    const centerY = bird.y + bird.height / 2;

    // Ground/ceiling collision
    if (centerY <= 0 || centerY >= canvasHeight - GROUND_HEIGHT) {
      return true;
    }

    // Pipe collision (using centroid)
    for (const pipe of pipes) {
      if (centerX >= pipe.x && centerX <= pipe.x + pipe.width) {
        if (centerY <= pipe.topHeight || centerY >= pipe.bottomY) {
          return true;
        }
      }
    }

    return false;
  }, []);

  const spawnPipe = useCallback((canvasHeight: number) => {
    const minTopHeight = 50;
    const maxTopHeight = canvasHeight - GROUND_HEIGHT - PIPE_GAP - 50;
    const topHeight = Math.random() * (maxTopHeight - minTopHeight) + minTopHeight;

    pipesRef.current.push({
      x: 400,
      topHeight,
      bottomY: topHeight + PIPE_GAP,
      width: PIPE_WIDTH,
      gap: PIPE_GAP,
      passed: false,
    });
  }, []);

  const drawBird = useCallback((ctx: CanvasRenderingContext2D, bird: Bird) => {
    ctx.save();
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
    ctx.rotate(bird.rotation);

    if (birdImageRef.current) {
      ctx.drawImage(
        birdImageRef.current,
        -bird.width / 2,
        -bird.height / 2,
        bird.width,
        bird.height
      );
    } else {
      // Default bird drawing
      // Body
      const gradient = ctx.createRadialGradient(0, 0, 5, 0, 0, bird.width / 2);
      gradient.addColorStop(0, '#FFE066');
      gradient.addColorStop(1, '#F59E0B');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, bird.width / 2, bird.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(8, -5, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.arc(10, -5, 4, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(25, 3);
      ctx.lineTo(15, 6);
      ctx.closePath();
      ctx.fill();

      // Wing
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.ellipse(-5, 5, 10, 6, -0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }, []);

  const drawPipe = useCallback((ctx: CanvasRenderingContext2D, pipe: Pipe, canvasHeight: number) => {
    const pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
    pipeGradient.addColorStop(0, '#15803D');
    pipeGradient.addColorStop(0.3, '#22C55E');
    pipeGradient.addColorStop(0.7, '#22C55E');
    pipeGradient.addColorStop(1, '#15803D');

    // Top pipe
    ctx.fillStyle = pipeGradient;
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);

    // Top pipe cap
    ctx.fillStyle = '#16A34A';
    ctx.fillRect(pipe.x - 5, pipe.topHeight - 25, pipe.width + 10, 25);
    ctx.strokeStyle = '#15803D';
    ctx.lineWidth = 2;
    ctx.strokeRect(pipe.x - 5, pipe.topHeight - 25, pipe.width + 10, 25);

    // Bottom pipe
    ctx.fillStyle = pipeGradient;
    ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, canvasHeight - pipe.bottomY - GROUND_HEIGHT);

    // Bottom pipe cap
    ctx.fillStyle = '#16A34A';
    ctx.fillRect(pipe.x - 5, pipe.bottomY, pipe.width + 10, 25);
    ctx.strokeStyle = '#15803D';
    ctx.strokeRect(pipe.x - 5, pipe.bottomY, pipe.width + 10, 25);
  }, []);

  const drawGround = useCallback((ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    const groundY = canvasHeight - GROUND_HEIGHT;

    // Ground base
    const groundGradient = ctx.createLinearGradient(0, groundY, 0, canvasHeight);
    groundGradient.addColorStop(0, '#92400E');
    groundGradient.addColorStop(0.3, '#A16207');
    groundGradient.addColorStop(1, '#78350F');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, groundY, canvasWidth, GROUND_HEIGHT);

    // Grass on top
    ctx.fillStyle = '#22C55E';
    ctx.fillRect(0, groundY, canvasWidth, 15);

    // Grass details
    ctx.fillStyle = '#16A34A';
    for (let x = groundOffsetRef.current % 20; x < canvasWidth; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, groundY + 15);
      ctx.lineTo(x + 5, groundY);
      ctx.lineTo(x + 10, groundY + 15);
      ctx.fill();
    }
  }, []);

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight - GROUND_HEIGHT);
    skyGradient.addColorStop(0, '#60A5FA');
    skyGradient.addColorStop(0.5, '#93C5FD');
    skyGradient.addColorStop(1, '#BFDBFE');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight - GROUND_HEIGHT);

    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const drawCloud = (x: number, y: number, scale: number) => {
      ctx.beginPath();
      ctx.arc(x, y, 20 * scale, 0, Math.PI * 2);
      ctx.arc(x + 25 * scale, y - 10 * scale, 25 * scale, 0, Math.PI * 2);
      ctx.arc(x + 50 * scale, y, 20 * scale, 0, Math.PI * 2);
      ctx.arc(x + 25 * scale, y + 5 * scale, 15 * scale, 0, Math.PI * 2);
      ctx.fill();
    };

    drawCloud(50, 80, 1);
    drawCloud(200, 120, 0.7);
    drawCloud(320, 60, 0.9);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      resetGame();
    }
  }, [isPlaying, resetGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;

    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      drawBackground(ctx, canvas.width, canvas.height);

      if (isPlaying) {
        // Update bird physics
        const bird = birdRef.current;
        bird.velocity += GRAVITY;
        bird.y += bird.velocity;

        // Update bird rotation based on velocity
        bird.rotation = Math.min(Math.max(bird.velocity * 0.05, -0.5), 1.2);

        // Spawn pipes
        if (timestamp - lastPipeSpawnRef.current > PIPE_SPAWN_INTERVAL) {
          spawnPipe(canvas.height);
          lastPipeSpawnRef.current = timestamp;
        }

        // Update pipes
        pipesRef.current = pipesRef.current.filter(pipe => {
          pipe.x -= PIPE_SPEED;

          // Check if bird passed pipe
          if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
            scoreRef.current++;
            onScoreUpdate(scoreRef.current);
            playScore();
          }

          return pipe.x > -pipe.width;
        });

        // Update ground animation
        groundOffsetRef.current = (groundOffsetRef.current + PIPE_SPEED) % 20;

        // Check collisions
        if (checkCollision(bird, pipesRef.current, canvas.height)) {
          playCollision();
          onGameOver(scoreRef.current);
          return;
        }
      }

      // Draw pipes
      pipesRef.current.forEach(pipe => drawPipe(ctx, pipe, canvas.height));

      // Draw ground
      drawGround(ctx, canvas.width, canvas.height);

      // Draw bird
      drawBird(ctx, birdRef.current);

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, checkCollision, drawBackground, drawBird, drawGround, drawPipe, onGameOver, onScoreUpdate, playCollision, playScore, spawnPipe]);

  useEffect(() => {
    const handleInteraction = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      flap();
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousedown', handleInteraction);
      canvas.addEventListener('touchstart', handleInteraction, { passive: false });
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('mousedown', handleInteraction);
        canvas.removeEventListener('touchstart', handleInteraction);
      }
    };
  }, [flap]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={600}
      className="rounded-2xl shadow-2xl border-4 border-foreground/10 cursor-pointer touch-none max-w-full"
      style={{ maxHeight: 'calc(100vh - 200px)' }}
    />
  );
}
