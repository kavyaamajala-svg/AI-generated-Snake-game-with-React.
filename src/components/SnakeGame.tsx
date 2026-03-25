import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 150;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED - Math.min(score / 5, 100));
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver, score]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex justify-between items-end w-full px-2">
        <div className="text-[#00ffff] font-mono text-5xl font-black italic tracking-tighter glitch-text drop-shadow-[0_0_15px_#00ffff]">
          DATA: {score}
        </div>
        <div className="text-[#ff00ff] font-mono text-xl drop-shadow-[0_0_10px_#ff00ff] pb-1 animate-pulse">
          {isPaused ? '::HALTED::' : '::RUNNING::'}
        </div>
      </div>

      <div 
        className="relative bg-black border-4 border-[#00ffff] overflow-hidden shadow-[0_0_40px_rgba(0,255,255,0.2)]"
        style={{ width: GRID_SIZE * 20, height: GRID_SIZE * 20 }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-20">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-[#ff00ff]/30" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{ x: segment.x * 20, y: segment.y * 20 }}
            className={`absolute w-5 h-5 ${
              i === 0 ? 'bg-[#00ffff] z-10 shadow-[0_0_15px_#00ffff]' : 'bg-[#00ffff]/40 border border-[#00ffff]/20'
            }`}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="absolute w-5 h-5 bg-[#ff00ff] shadow-[0_0_20px_#ff00ff]"
          style={{ left: food.x * 20, top: food.y * 20 }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-[#ff00ff]"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-6xl font-black text-[#ff00ff] mb-8 glitch" data-text="FATAL_ERROR">FATAL_ERROR</h2>
                  <button
                    onClick={resetGame}
                    className="px-12 py-4 border-4 border-[#00ffff] text-[#00ffff] font-black text-2xl hover:bg-[#00ffff] hover:text-black transition-all active:scale-95"
                  >
                    REBOOT_SYSTEM
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-6xl font-black text-[#00ffff] mb-8 glitch" data-text="INIT_LINK?">INIT_LINK?</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-12 py-4 border-4 border-[#ff00ff] text-[#ff00ff] font-black text-2xl hover:bg-[#ff00ff] hover:text-black transition-all active:scale-95"
                  >
                    EXECUTE
                  </button>
                  <p className="mt-8 text-[#00ffff]/50 text-xs tracking-[0.5em] animate-pulse">INPUT_REQUIRED: ARROW_KEYS</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
