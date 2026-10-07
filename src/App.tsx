import React, { useState, useEffect, useRef, useCallback } from 'react';
import type {
  AppState,
  Direction,
  Position,
  GameSettings,
  Particle,
  GameMode,
  SpeedPreset,
  SpecialFood,
  PlayerStats,
  LeaderboardEntry,
  DailyChallenge as DailyChallengeType,
} from './types/game';
import {
  INITIAL_SNAKE,
  INITIAL_DIRECTION,
  POINTS_PER_FOOD,
  GRID_SIZE,
} from './game/constants';
import {
  getNextHead,
  isOutOfBounds,
  isCollidingWithSelf,
  generateFood,
  isValidDirectionChange,
  calculateLevel,
  calculateSpeed,
} from './game/engine';
import { storage } from './utils/storage';
import { soundManager } from './utils/sound';
import {
  ACHIEVEMENTS_LIST,
  generateTodayChallenge,
  calculatePlayerLevel,
} from './systems/progression';

import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { GameBoard } from './components/GameBoard';
import { ScoreBoard } from './components/ScoreBoard';
import { Controls } from './components/Controls';
import { PauseOverlay } from './components/PauseOverlay';
import { GameOver } from './components/GameOver';
import { HowToPlay } from './components/HowToPlay';
import { Settings } from './components/Settings';
import { ModeSelector } from './components/ModeSelector';
import { Customize } from './components/Customize';
import { Achievements } from './components/Achievements';
import { Stats } from './components/Stats';
import { DailyChallenge } from './components/DailyChallenge';
import { CountdownOverlay } from './components/CountdownOverlay';

export const App: React.FC = () => {
  // App & Storage State
  const [appState, setAppState] = useState<AppState>('MENU');
  const [highScore, setHighScore] = useState<number>(() => storage.getHighScore());
  const [settings, setSettings] = useState<GameSettings>(() => storage.getSettings());
  const [stats, setStats] = useState<PlayerStats>(() => storage.getStats());
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => storage.getUnlockedAchievements());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => storage.getLeaderboard());
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallengeType>(() => {
    const existing = storage.getDailyChallenge();
    const today = generateTodayChallenge();
    if (existing && existing.dateStr === today.dateStr) return existing;
    storage.saveDailyChallenge(today);
    return today;
  });

  // Selected Mode & Speed
  const [selectedMode, setSelectedMode] = useState<GameMode>('CLASSIC');
  const [selectedSpeed, setSelectedSpeed] = useState<SpeedPreset>('CLASSIC');

  // Gameplay State
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>(() => generateFood(INITIAL_SNAKE));
  const [specialFood, setSpecialFood] = useState<SpecialFood | null>(null);
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [combo, setCombo] = useState<number>(1);
  const [timeAttackLeft, setTimeAttackLeft] = useState<number>(60);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [isCountdown, setIsCountdown] = useState<boolean>(false);
  const [achievementToast, setAchievementToast] = useState<string | null>(null);

  // Player Name Prompt for Leaderboard on Game Over
  const [playerNameInput, setPlayerNameInput] = useState<string>('SLITHER');
  const [showNameDialog, setShowNameDialog] = useState<boolean>(false);

  // Refs for smooth animation & non-stale callbacks in interval
  const directionQueueRef = useRef<Direction[]>([]);
  const currentDirectionRef = useRef<Direction>(INITIAL_DIRECTION);
  const snakeRef = useRef<Position[]>(INITIAL_SNAKE);
  const prevSnakeRef = useRef<Position[]>(INITIAL_SNAKE);
  const lastTickTimeRef = useRef<number>(performance.now());
  const foodRef = useRef<Position>(food);
  const specialFoodRef = useRef<SpecialFood | null>(null);
  const scoreRef = useRef<number>(0);
  const levelRef = useRef<number>(1);
  const comboRef = useRef<number>(1);
  const lastEatTimeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const activeRunStartTimeRef = useRef<number>(0);

  // Sync refs with state
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { specialFoodRef.current = specialFood; }, [specialFood]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { comboRef.current = combo; }, [combo]);

  // Sync Sound controller settings
  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled, settings.vibrationEnabled);
  }, [settings.soundEnabled, settings.vibrationEnabled]);

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    storage.saveSettings(updated);
  };

  // Trigger Achievement Unlock Toast
  const triggerAchievement = useCallback((id: string) => {
    if (unlockedAchievements.includes(id)) return;
    const ach = ACHIEVEMENTS_LIST.find((a) => a.id === id);
    if (!ach) return;

    const updated = [...unlockedAchievements, id];
    setUnlockedAchievements(updated);
    storage.saveUnlockedAchievements(updated);

    setAchievementToast(`ACHIEVEMENT UNLOCKED: ${ach.title}`);
    soundManager.playHighScore();

    setTimeout(() => {
      setAchievementToast(null);
    }, 3500);
  }, [unlockedAchievements]);

  // Direction Change Handler (Prevents 180° self-collision)
  const handleDirectionChange = useCallback((newDir: Direction) => {
    const queue = directionQueueRef.current;
    const lastDir = queue.length > 0 ? queue[queue.length - 1] : currentDirectionRef.current;
    if (isValidDirectionChange(lastDir, newDir) && queue.length < 2) {
      queue.push(newDir);
    }
  }, []);

  // Spawn Food Particles
  const spawnFoodParticles = (foodPos: Position, colorOverride?: string) => {
    const canvas = document.querySelector('.game-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cellSize = rect.width / GRID_SIZE;
    const px = foodPos.x * cellSize + cellSize / 2;
    const py = foodPos.y * cellSize + cellSize / 2;

    const colors = colorOverride ? [colorOverride, '#ffffff'] : ['#22d3ee', '#00f3ff', '#3b82f6', '#ffffff'];

    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3.5;
      particlesRef.current.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 20 + Math.floor(Math.random() * 15),
        maxLife: 35,
        size: 2 + Math.random() * 3,
      });
    }
  };

  // Start new game
  const startGame = useCallback((mode: GameMode = selectedMode) => {
    setSelectedMode(mode);
    const initSnake = INITIAL_SNAKE;
    const initDir = INITIAL_DIRECTION;
    const initFood = generateFood(initSnake);

    setSnake(initSnake);
    setDirection(initDir);
    setFood(initFood);
    setSpecialFood(null);
    setScore(0);
    setLevel(1);
    setCombo(1);
    setTimeAttackLeft(60);
    setIsNewHighScore(false);
    setShowNameDialog(false);

    directionQueueRef.current = [];
    currentDirectionRef.current = initDir;
    snakeRef.current = initSnake;
    prevSnakeRef.current = initSnake;
    lastTickTimeRef.current = performance.now();
    foodRef.current = initFood;
    specialFoodRef.current = null;
    scoreRef.current = 0;
    levelRef.current = 1;
    comboRef.current = 1;
    lastEatTimeRef.current = 0;
    particlesRef.current = [];
    activeRunStartTimeRef.current = performance.now();

    setAppState('PLAYING');
    setIsCountdown(true);
    soundManager.playClick();
  }, [selectedMode]);

  // Single game tick logic
  const tick = useCallback(() => {
    const curSnake = snakeRef.current;
    prevSnakeRef.current = curSnake;
    lastTickTimeRef.current = performance.now();

    // Dequeue direction input
    const queue = directionQueueRef.current;
    let curDirection = currentDirectionRef.current;
    if (queue.length > 0) {
      curDirection = queue.shift()!;
    }
    currentDirectionRef.current = curDirection;
    setDirection(curDirection);

    const head = curSnake[0];
    let newHead = getNextHead(head, curDirection);

    // Zen Mode Wall Wrap
    if (selectedMode === 'ZEN') {
      if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
      else if (newHead.x >= GRID_SIZE) newHead.x = 0;
      if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
      else if (newHead.y >= GRID_SIZE) newHead.y = 0;
    } else {
      // Wall Collision
      if (isOutOfBounds(newHead)) {
        handleGameOver();
        return;
      }
    }

    const curFood = foodRef.current;
    const curSpecial = specialFoodRef.current;

    const isEatingFood = newHead.x === curFood.x && newHead.y === curFood.y;
    const isEatingSpecial = curSpecial && newHead.x === curSpecial.x && newHead.y === curSpecial.y;

    const bodyToCheck = (isEatingFood || isEatingSpecial) ? curSnake : curSnake.slice(0, -1);

    // Self Collision Check (Zen mode ignores self collision if length < 6)
    if (selectedMode !== 'ZEN' && isCollidingWithSelf(newHead, bodyToCheck)) {
      handleGameOver();
      return;
    }

    // Move snake
    let newSnake: Position[];
    if (isEatingFood || isEatingSpecial) {
      newSnake = [newHead, ...curSnake];
      const now = performance.now();

      // Combo System: Check if eaten within 3 seconds
      if (now - lastEatTimeRef.current < 3000) {
        const nextCombo = Math.min(5, comboRef.current + 1);
        setCombo(nextCombo);
        soundManager.playCombo();
      } else {
        setCombo(1);
      }
      lastEatTimeRef.current = now;

      let pointsEarned = POINTS_PER_FOOD * comboRef.current;
      if (selectedMode === 'HARDCORE') pointsEarned = Math.floor(pointsEarned * 1.5);

      if (isEatingSpecial && curSpecial) {
        if (curSpecial.type === 'GOLDEN') pointsEarned += 50;
        else if (curSpecial.type === 'DIAMOND') pointsEarned += 100;
        spawnFoodParticles(curSpecial, '#fbbf24');
        setSpecialFood(null);
        soundManager.playSpecialEat();
      } else {
        spawnFoodParticles(curFood);
        soundManager.playEat();

        // 15% chance to spawn special rare food
        if (Math.random() < 0.15 && !curSpecial) {
          const specTypes: ('GOLDEN' | 'DIAMOND' | 'SLOW' | 'SPEED')[] = ['GOLDEN', 'DIAMOND', 'SLOW', 'SPEED'];
          const randomType = specTypes[Math.floor(Math.random() * specTypes.length)];
          const specPos = generateFood(newSnake);
          setSpecialFood({ x: specPos.x, y: specPos.y, type: randomType });
        }
      }

      const newScore = scoreRef.current + pointsEarned;
      setScore(newScore);

      const newLevel = calculateLevel(newScore);
      if (newLevel > levelRef.current) {
        setLevel(newLevel);
        soundManager.playLevelUp();
        if (newLevel >= 10) triggerAchievement('speed_demon');
      }

      // Achievement checks
      triggerAchievement('first_bite');
      if (newSnake.length >= 20) triggerAchievement('growing_up');
      if (newScore >= 100) triggerAchievement('century');
      if (newScore >= 500) triggerAchievement('untouchable');
      if (newScore >= 1000) triggerAchievement('snake_king');

      const nextFood = generateFood(newSnake);
      setFood(nextFood);
    } else {
      newSnake = [newHead, ...curSnake.slice(0, -1)];

      // Reset combo if more than 3 seconds elapsed
      if (performance.now() - lastEatTimeRef.current > 3000 && comboRef.current > 1) {
        setCombo(1);
      }
    }

    setSnake(newSnake);
  }, [selectedMode, triggerAchievement]);

  // Handle Game Over
  const handleGameOver = useCallback(() => {
    setAppState('GAME_OVER');
    soundManager.playGameOver();

    const currentScore = scoreRef.current;
    const runDurationSec = Math.floor((performance.now() - activeRunStartTimeRef.current) / 1000);

    const isNewBest = storage.saveHighScore(currentScore);

    if (isNewBest) {
      setHighScore(currentScore);
      setIsNewHighScore(true);
      soundManager.playHighScore();
      triggerAchievement('new_heights');
    }

    // Check survivor achievement
    if (runDurationSec >= 120) triggerAchievement('survivor');

    // Update Career Stats & XP
    const curStats = storage.getStats();
    const updatedStats: PlayerStats = {
      ...curStats,
      bestScore: Math.max(curStats.bestScore, currentScore),
      longestSnake: Math.max(curStats.longestSnake, snakeRef.current.length),
      bestLevel: Math.max(curStats.bestLevel, levelRef.current),
      foodEaten: curStats.foodEaten + Math.floor(currentScore / 10),
      gamesPlayed: curStats.gamesPlayed + 1,
      totalPlayTime: curStats.totalPlayTime + runDurationSec,
      timeAttackBest: selectedMode === 'TIME_ATTACK' ? Math.max(curStats.timeAttackBest, currentScore) : curStats.timeAttackBest,
      hardcoreBest: selectedMode === 'HARDCORE' ? Math.max(curStats.hardcoreBest, currentScore) : curStats.hardcoreBest,
      playerXP: curStats.playerXP + currentScore + 100,
      playerLevel: calculatePlayerLevel(curStats.playerXP + currentScore + 100).level,
    };
    setStats(updatedStats);
    storage.saveStats(updatedStats);

    // Update Daily Challenge progress
    if (dailyChallenge && !dailyChallenge.completed) {
      const newCurrent = Math.min(dailyChallenge.target, dailyChallenge.current + currentScore);
      const isCompleted = newCurrent >= dailyChallenge.target;
      const updatedDaily = {
        ...dailyChallenge,
        current: newCurrent,
        completed: isCompleted,
      };
      setDailyChallenge(updatedDaily);
      storage.saveDailyChallenge(updatedDaily);
    }

    // Check if score qualifies for Local Leaderboard
    if (currentScore > 0) {
      const curBoard = storage.getLeaderboard();
      if (curBoard.length < 10 || currentScore > curBoard[curBoard.length - 1]?.score) {
        setShowNameDialog(true);
      }
    }
  }, [selectedMode, triggerAchievement, dailyChallenge]);

  // Submit Leaderboard Entry
  const handleSaveLeaderboardEntry = () => {
    if (!playerNameInput.trim()) return;
    const updated = storage.addLeaderboardEntry({
      name: playerNameInput.trim().substring(0, 12).toUpperCase(),
      score: score,
      mode: selectedMode,
      date: new Date().toLocaleDateString(),
    });
    setLeaderboard(updated);
    setShowNameDialog(false);
  };

  // Keyboard Controls Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        if (['PLAYING', 'PAUSED'].includes(appState)) {
          e.preventDefault();
        }
      }

      if (appState === 'PLAYING' && !isCountdown) {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') handleDirectionChange('UP');
        else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') handleDirectionChange('DOWN');
        else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') handleDirectionChange('LEFT');
        else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') handleDirectionChange('RIGHT');
        else if (e.code === 'Space') {
          setAppState('PAUSED');
          soundManager.playClick();
        } else if (e.key === 'r' || e.key === 'R') {
          startGame();
        }
      } else if (appState === 'PAUSED') {
        if (e.code === 'Space') {
          setAppState('PLAYING');
          soundManager.playClick();
        } else if (e.key === 'r' || e.key === 'R') {
          startGame();
        }
      } else if (appState === 'GAME_OVER') {
        if (e.code === 'Space' || e.key === 'r' || e.key === 'R') {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState, isCountdown, handleDirectionChange, startGame]);

  // Game Loop Interval
  useEffect(() => {
    if (appState !== 'PLAYING' || isCountdown) return;

    let baseSpeed = calculateSpeed(level);
    if (selectedSpeed === 'CHILL') baseSpeed += 40;
    else if (selectedSpeed === 'FAST') baseSpeed = Math.max(50, baseSpeed - 30);
    else if (selectedSpeed === 'INSANE') baseSpeed = Math.max(40, baseSpeed - 60);

    if (selectedMode === 'HARDCORE') baseSpeed = Math.max(40, baseSpeed - 40);
    else if (selectedMode === 'ZEN') baseSpeed = 180;

    const interval = setInterval(tick, baseSpeed);
    return () => clearInterval(interval);
  }, [appState, isCountdown, level, selectedSpeed, selectedMode, tick]);

  // Time Attack 60-Second Countdown Timer
  useEffect(() => {
    if (appState !== 'PLAYING' || isCountdown || selectedMode !== 'TIME_ATTACK') return;

    const timer = setInterval(() => {
      setTimeAttackLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [appState, isCountdown, selectedMode, handleGameOver]);

  const handleToggleTheme = () => {
    const themes: GameSettings['theme'][] = ['midnight', 'ocean', 'galaxy', 'inferno', 'arctic', 'toxic', 'sakura', 'cyber'];
    const currentIndex = themes.indexOf(settings.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    handleUpdateSettings({ theme: nextTheme });
  };

  return (
    <div className={`app-root ${settings.theme}-theme`}>
      {/* Toast Notification Banner */}
      {achievementToast && (
        <div className="achievement-toast-banner">
          {achievementToast}
        </div>
      )}

      <Header
        appState={appState}
        score={score}
        highScore={highScore}
        onPlayNow={() => startGame('CLASSIC')}
        onHowToPlay={() => { soundManager.playClick(); setAppState('HOW_TO_PLAY'); }}
        onSettings={() => { soundManager.playClick(); setAppState('SETTINGS'); }}
        onHomeClick={() => { soundManager.playClick(); setAppState('MENU'); }}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => handleUpdateSettings({ soundEnabled: !settings.soundEnabled })}
        theme={settings.theme}
        onToggleTheme={handleToggleTheme}
        onTogglePause={() => {
          soundManager.playClick();
          setAppState(appState === 'PLAYING' ? 'PAUSED' : 'PLAYING');
        }}
        isPaused={appState === 'PAUSED'}
      />

      <main className="main-content">
        {/* Main Menu View */}
        {appState === 'MENU' && (
          <MainMenu
            highScore={highScore}
            onPlay={() => startGame('CLASSIC')}
            onSettings={() => { soundManager.playClick(); setAppState('SETTINGS'); }}
            onModes={() => { soundManager.playClick(); setAppState('MODES'); }}
            onCustomize={() => { soundManager.playClick(); setAppState('CUSTOMIZE'); }}
            onAchievements={() => { soundManager.playClick(); setAppState('ACHIEVEMENTS'); }}
            onStats={() => { soundManager.playClick(); setAppState('STATS'); }}
            onDaily={() => { soundManager.playClick(); setAppState('DAILY_CHALLENGE'); }}
            theme={settings.theme}
          />
        )}

        {/* Gameplay Arena View */}
        {(appState === 'PLAYING' || appState === 'PAUSED' || appState === 'GAME_OVER') && (
          <div className="game-screen-container">
            <ScoreBoard
              score={score}
              highScore={highScore}
              level={level}
              combo={combo}
              timeAttackLeft={selectedMode === 'TIME_ATTACK' ? timeAttackLeft : undefined}
              mode={selectedMode}
              soundEnabled={settings.soundEnabled}
              onToggleSound={() => handleUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              onTogglePause={() => {
                soundManager.playClick();
                setAppState(appState === 'PLAYING' ? 'PAUSED' : 'PLAYING');
              }}
              isPaused={appState === 'PAUSED'}
              theme={settings.theme}
            />

            <div className="game-board-relative">
              <GameBoard
                snake={snake}
                prevSnakeRef={prevSnakeRef}
                lastTickTimeRef={lastTickTimeRef}
                level={level}
                food={food}
                specialFood={specialFood}
                direction={direction}
                theme={settings.theme}
                skin={settings.skin}
                showGridLines={settings.showGridLines}
                isPaused={appState === 'PAUSED'}
                isGameOver={appState === 'GAME_OVER'}
                particlesRef={particlesRef}
                onDirectionChange={handleDirectionChange}
              />

              {/* 3-2-1-GO Countdown Overlay */}
              {isCountdown && appState === 'PLAYING' && (
                <CountdownOverlay onComplete={() => setIsCountdown(false)} />
              )}
            </div>

            <Controls
              onDirectionChange={handleDirectionChange}
              onPause={() => {
                soundManager.playClick();
                setAppState(appState === 'PLAYING' ? 'PAUSED' : 'PLAYING');
              }}
              onRestart={() => startGame()}
              theme={settings.theme}
              controlType={settings.controlType}
            />
          </div>
        )}

        {/* Mode Selector View */}
        {appState === 'MODES' && (
          <ModeSelector
            selectedMode={selectedMode}
            selectedSpeed={selectedSpeed}
            onSelectMode={setSelectedMode}
            onSelectSpeed={setSelectedSpeed}
            onStartGame={() => startGame(selectedMode)}
            onBack={() => { soundManager.playClick(); setAppState('MENU'); }}
            theme={settings.theme}
          />
        )}

        {/* Customize / Snake Lab View */}
        {appState === 'CUSTOMIZE' && (
          <Customize
            settings={settings}
            highScore={highScore}
            unlockedAchievementsCount={unlockedAchievements.length}
            onUpdateSettings={handleUpdateSettings}
            onBack={() => { soundManager.playClick(); setAppState('MENU'); }}
          />
        )}

        {/* Achievements View */}
        {appState === 'ACHIEVEMENTS' && (
          <Achievements
            unlockedIds={unlockedAchievements}
            onBack={() => { soundManager.playClick(); setAppState('MENU'); }}
            theme={settings.theme}
          />
        )}

        {/* Stats & Leaderboard View */}
        {appState === 'STATS' && (
          <Stats
            stats={stats}
            leaderboard={leaderboard}
            onBack={() => { soundManager.playClick(); setAppState('MENU'); }}
            theme={settings.theme}
          />
        )}

        {/* Daily Challenge View */}
        {appState === 'DAILY_CHALLENGE' && (
          <DailyChallenge
            challenge={dailyChallenge}
            onStartChallenge={() => startGame('CLASSIC')}
            onBack={() => { soundManager.playClick(); setAppState('MENU'); }}
            theme={settings.theme}
          />
        )}

        {/* Pause Overlay */}
        {appState === 'PAUSED' && (
          <PauseOverlay
            onResume={() => { soundManager.playClick(); setAppState('PLAYING'); }}
            onRestart={() => startGame()}
            onMainMenu={() => { soundManager.playClick(); setAppState('MENU'); }}
            theme={settings.theme}
          />
        )}

        {/* Game Over Modal */}
        {appState === 'GAME_OVER' && (
          <GameOver
            score={score}
            highScore={highScore}
            isNewHighScore={isNewHighScore}
            onPlayAgain={() => startGame()}
            onMainMenu={() => { soundManager.playClick(); setAppState('MENU'); }}
            theme={settings.theme}
          />
        )}

        {/* Leaderboard Name Prompt Dialog */}
        {showNameDialog && appState === 'GAME_OVER' && (
          <div className="modal-overlay name-dialog-overlay">
            <div className="modern-modal-card name-dialog-card">
              <h3>TOP SCORE RECORD!</h3>
              <p>Enter your player name for the local leaderboard:</p>
              <input
                type="text"
                maxLength={12}
                value={playerNameInput}
                onChange={(e) => setPlayerNameInput(e.target.value)}
                className="name-input-field"
                placeholder="YOUR NAME"
              />
              <button className="primary-play-cta full-width" onClick={handleSaveLeaderboardEntry}>
                SAVE ENTRY
              </button>
            </div>
          </div>
        )}

        {/* How To Play */}
        {appState === 'HOW_TO_PLAY' && (
          <HowToPlay
            onBack={() => { soundManager.playClick(); setAppState('MENU'); }}
            theme={settings.theme}
          />
        )}

        {/* Settings View */}
        {appState === 'SETTINGS' && (
          <Settings
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onBack={() => { soundManager.playClick(); setAppState('MENU'); }}
            onResetProgress={() => {
              if (window.confirm('Are you sure you want to reset all high scores, stats, and achievements?')) {
                storage.resetAllProgress();
                setHighScore(0);
                setStats(storage.getStats());
                setUnlockedAchievements([]);
                setLeaderboard([]);
                alert('Progress reset successfully.');
              }
            }}
          />
        )}
      </main>
    </div>
  );
};

export default App;
