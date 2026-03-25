import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Activity, Zap, AlertTriangle } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 120;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const lastProcessedDirection = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      lastProcessedDirection.current = direction;

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPaused(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 1);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (lastProcessedDirection.current.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (lastProcessedDirection.current.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (lastProcessedDirection.current.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (lastProcessedDirection.current.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      const interval = setInterval(moveSnake, SPEED);
      return () => clearInterval(interval);
    }
  }, [moveSnake, isPaused, isGameOver]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black border-4 border-neon-blue shadow-[0_0_20px_#00ffff] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-neon-blue/20 animate-pulse" />
      
      <div className="flex justify-between w-full mb-6 px-2 font-pixel">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-neon-blue animate-pulse" />
          <span className="text-2xl text-neon-blue tracking-widest">DATA_HARVEST: {score.toString().padStart(4, '0')}</span>
        </div>
        <div className="text-neon-pink/80 text-xl tracking-widest">
          MAX_SYNC: {highScore.toString().padStart(4, '0')}
        </div>
      </div>

      <div 
        className="relative bg-[#050505] border-4 border-neon-pink shadow-[0_0_15px_#ff00ff] overflow-hidden"
        style={{ 
          width: GRID_SIZE * 18, 
          height: GRID_SIZE * 18,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid lines for retro feel */}
        <div className="absolute inset-0 pointer-events-none opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)',
               backgroundSize: '18px 18px'
             }} 
        />

        {/* Snake segments */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`${i === 0 ? 'bg-neon-blue shadow-[0_0_15px_#00ffff] z-10' : 'bg-neon-blue/40'} border border-black`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
          className="bg-neon-pink shadow-[0_0_15px_#ff00ff] z-10"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-6 z-20 font-pixel"
            >
              {isGameOver ? (
                <>
                  <div className="flex flex-col items-center gap-2">
                    <AlertTriangle className="w-16 h-16 text-neon-pink animate-bounce" />
                    <h2 className="text-5xl font-bold text-neon-pink glitch-text" data-text="SYSTEM_CRASH">SYSTEM_CRASH</h2>
                  </div>
                  <button
                    onClick={resetGame}
                    className="px-10 py-3 bg-neon-pink text-black text-2xl font-bold hover:bg-black hover:text-neon-pink border-4 border-neon-pink transition-all active:scale-95"
                  >
                    REBOOT_CORE
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center gap-2">
                    <Zap className="w-16 h-16 text-neon-blue animate-pulse" />
                    <h2 className="text-5xl font-bold text-neon-blue glitch-text" data-text="LINK_SUSPENDED">LINK_SUSPENDED</h2>
                  </div>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-10 py-3 bg-neon-blue text-black text-2xl font-bold hover:bg-black hover:text-neon-blue border-4 border-neon-blue transition-all active:scale-95"
                  >
                    RESUME_SYNC
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center gap-4 text-xl text-neon-blue/60 font-pixel tracking-[0.2em]">
        <Terminal className="w-5 h-5" />
        <span>INPUT_REQUIRED: [ARROWS] TO_STEER | [SPACE] TO_HALT</span>
      </div>
    </div>
  );
};
