import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Heart,
  Pause,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Home as HomeIcon,
  Palette,
  ShoppingCart,
  User,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { ThemePalette, ALL_THEMES, GALLERY_MEDIA } from '../data/tapArcadeData';
import { soundEngine } from '../utils/soundEngine';
import { ResilientImage } from './ResilientImage';

interface PlayablePhoneDemoProps {
  activeTheme: ThemePalette;
  onSelectTheme: (theme: ThemePalette) => void;
  externalPlayTrigger: number;
}

type PhoneMode = 'interactive' | 'screenshot';
type AppTab = 'home' | 'themes' | 'shop' | 'profile';
type GameState = 'IDLE_APP' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'ABANDON_CONFIRM' | 'GAME_OVER';

interface ActiveEntity {
  id: number;
  type: 'target' | 'hazard';
  x: number;
  y: number;
  radius: number;
  spawnTimeMs: number;
  lifetimeMs: number;
  isProcessed: boolean;
}

interface FloatingFeedback {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  createdAt: number;
}

interface TapRipple {
  id: number;
  x: number;
  y: number;
  color: string;
  createdAt: number;
}

interface LocalDemoStats {
  coins: number;
  diamonds: number;
  personalBest: number;
  completedGames: number;
  totalPlaytimeSeconds: number;
  ownedThemeIds: string[];
}

const DEFAULT_STATS: LocalDemoStats = {
  coins: 560,
  diamonds: 150,
  personalBest: 660,
  completedGames: 3,
  totalPlaytimeSeconds: 198,
  ownedThemeIds: ['pure', 'sunset'],
};

const CANVAS_WIDTH = 344;
const CANVAS_HEIGHT = 608;
const ENTITY_RADIUS = 28;
const MIN_CENTER_DIST = 76;
const TOP_SAFE_ZONE = 86;
const SIDE_PADDING = 40;
const BOTTOM_PADDING = 48;

export const PlayablePhoneDemo: React.FC<PlayablePhoneDemoProps> = ({
  activeTheme,
  onSelectTheme,
  externalPlayTrigger,
}) => {
  const [phoneMode, setPhoneMode] = useState<PhoneMode>('interactive');
  const [rawScreenIndex, setRawScreenIndex] = useState<number>(0);
  const [appTab, setAppTab] = useState<AppTab>('home');
  const [shopSubTab, setShopSubTab] = useState<'coins' | 'diamonds'>('coins');
  const [themeSubTab, setThemeSubTab] = useState<'Free' | 'Coin' | 'Premium'>('Coin');

  const [gameState, setGameState] = useState<GameState>('IDLE_APP');
  const [countdownStep, setCountdownStep] = useState<string>('3');
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Game Over state
  const [finalScore, setFinalScore] = useState<number>(0);
  const [animatedCoinsEarned, setAnimatedCoinsEarned] = useState<number>(0);
  const [isNewPersonalBest, setIsNewPersonalBest] = useState<boolean>(false);

  // Local persisted stats (mirroring Jetpack DataStore)
  const [stats, setStats] = useState<LocalDemoStats>(() => {
    try {
      const saved = localStorage.getItem('tap_arcade_demo_stats_v1');
      if (saved) {
        return { ...DEFAULT_STATS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_STATS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('tap_arcade_demo_stats_v1', JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  const rawScreens = GALLERY_MEDIA.filter((item) => item.category === 'raw');

  // Mutable game engine refs for 60 FPS loop without React re-render lag
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const entitiesRef = useRef<ActiveEntity[]>([]);
  const feedbacksRef = useRef<FloatingFeedback[]>([]);
  const ripplesRef = useRef<TapRipple[]>([]);
  const nextEntityIdRef = useRef<number>(1);
  const scoreRef = useRef<number>(0);
  const livesRef = useRef<number>(3);
  const activePlayElapsedMsRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number | null>(null);
  const lastTargetSpawnMsRef = useRef<number>(0);
  const lastHazardSpawnMsRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const runCreditedRef = useRef<boolean>(false);
  const activeThemeRef = useRef<ThemePalette>(activeTheme);

  useEffect(() => {
    activeThemeRef.current = activeTheme;
  }, [activeTheme]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.setEnabled(next);
  };

  // Start Countdown (3 -> 2 -> 1 -> Go!)
  const startNewRun = useCallback(() => {
    setPhoneMode('interactive');
    soundEngine.stopAll();
    entitiesRef.current = [];
    feedbacksRef.current = [];
    ripplesRef.current = [];
    scoreRef.current = 0;
    livesRef.current = 3;
    activePlayElapsedMsRef.current = 0;
    lastFrameTimeRef.current = null;
    lastTargetSpawnMsRef.current = 0;
    lastHazardSpawnMsRef.current = 0;
    runCreditedRef.current = false;

    setScore(0);
    setLives(3);
    setElapsedSeconds(0);
    setCountdownStep('3');
    setGameState('COUNTDOWN');
  }, []);

  // Respond to Hero "Play Live Browser Demo" button click
  useEffect(() => {
    if (externalPlayTrigger > 0) {
      startNewRun();
    }
  }, [externalPlayTrigger, startNewRun]);

  // Countdown sequence effect
  useEffect(() => {
    if (gameState !== 'COUNTDOWN') return;

    const steps: Array<{ label: string; isGo: boolean; delay: number }> = [
      { label: '3', isGo: false, delay: 0 },
      { label: '2', isGo: false, delay: 850 },
      { label: '1', isGo: false, delay: 1700 },
      { label: 'Go!', isGo: true, delay: 2550 },
    ];

    const timers: number[] = [];

    steps.forEach((step) => {
      const t = window.setTimeout(() => {
        setCountdownStep(step.label);
        soundEngine.playCountdownTick(step.isGo);
      }, step.delay);
      timers.push(t);
    });

    const startPlayTimer = window.setTimeout(() => {
      lastFrameTimeRef.current = performance.now();
      lastTargetSpawnMsRef.current = 0;
      lastHazardSpawnMsRef.current = 0;
      setGameState('PLAYING');
    }, 3300);
    timers.push(startPlayTimer);

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [gameState]);

  // Trigger natural Game Over & credit local coins once
  const triggerNaturalGameOver = useCallback(() => {
    soundEngine.stopAll();
    soundEngine.playGameOverArpeggio();

    const finalPts = scoreRef.current;
    const runDurationSec = Math.max(1, Math.round(activePlayElapsedMsRef.current / 1000));

    setFinalScore(finalPts);
    setAnimatedCoinsEarned(0);

    if (!runCreditedRef.current) {
      runCreditedRef.current = true;
      setStats((prev) => {
        const isBest = finalPts > prev.personalBest;
        setIsNewPersonalBest(isBest);
        return {
          ...prev,
          coins: prev.coins + finalPts,
          personalBest: isBest ? finalPts : prev.personalBest,
          completedGames: prev.completedGames + 1,
          totalPlaytimeSeconds: prev.totalPlaytimeSeconds + runDurationSec,
        };
      });
    }

    setGameState('GAME_OVER');
  }, []);

  // Smooth 600ms count-up animation for earned coins on Game Over
  useEffect(() => {
    if (gameState !== 'GAME_OVER') return;
    if (finalScore === 0) {
      setAnimatedCoinsEarned(0);
      return;
    }

    const durationMs = 600;
    const startTs = performance.now();
    let frameId: number;

    const stepCountUp = (now: number) => {
      const progress = Math.min(1, (now - startTs) / durationMs);
      setAnimatedCoinsEarned(Math.round(progress * finalScore));
      if (progress < 1) {
        frameId = requestAnimationFrame(stepCountUp);
      }
    };

    frameId = requestAnimationFrame(stepCountUp);
    return () => cancelAnimationFrame(frameId);
  }, [gameState, finalScore]);

  // Spawn non-overlapping entity (Target or Hazard)
  const spawnEntity = (type: 'target' | 'hazard', currentElapsedMs: number, lifetimeMs: number) => {
    const activeCount = entitiesRef.current.filter((e) => e.type === type && !e.isProcessed).length;
    if (activeCount >= 4) return;

    const minX = SIDE_PADDING + ENTITY_RADIUS;
    const maxX = CANVAS_WIDTH - SIDE_PADDING - ENTITY_RADIUS;
    const minY = TOP_SAFE_ZONE + ENTITY_RADIUS;
    const maxY = CANVAS_HEIGHT - BOTTOM_PADDING - ENTITY_RADIUS;

    for (let attempt = 0; attempt < 24; attempt++) {
      const candidateX = minX + Math.random() * (maxX - minX);
      const candidateY = minY + Math.random() * (maxY - minY);

      const hasOverlap = entitiesRef.current.some((existing) => {
        if (existing.isProcessed) return false;
        const dx = existing.x - candidateX;
        const dy = existing.y - candidateY;
        return Math.hypot(dx, dy) < MIN_CENTER_DIST;
      });

      if (!hasOverlap) {
        entitiesRef.current.push({
          id: nextEntityIdRef.current++,
          type,
          x: candidateX,
          y: candidateY,
          radius: ENTITY_RADIUS,
          spawnTimeMs: currentElapsedMs,
          lifetimeMs,
          isProcessed: false,
        });
        return;
      }
    }
  };

  // Main 60 FPS Canvas Game Loop
  useEffect(() => {
    if (gameState !== 'PLAYING' && gameState !== 'PAUSED' && gameState !== 'ABANDON_CONFIRM') {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      return;
    }

    const renderFrame = (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const theme = activeThemeRef.current;

      if (gameState === 'PLAYING') {
        if (lastFrameTimeRef.current === null) {
          lastFrameTimeRef.current = now;
        }
        const deltaMs = Math.min(100, now - lastFrameTimeRef.current);
        lastFrameTimeRef.current = now;
        activePlayElapsedMsRef.current += deltaMs;

        const elapsedSec = activePlayElapsedMsRef.current / 1000;
        const currentSecondInt = Math.floor(elapsedSec);
        setElapsedSeconds((prev) => (prev !== currentSecondInt ? currentSecondInt : prev));

        // Difficulty Progression every 30s
        const step = Math.floor(elapsedSec / 30);
        const targetLifetimeMs = Math.max(0.8, 2.0 - step * 0.15) * 1000;
        const targetSpawnIntervalMs = Math.max(0.6, 1.2 - step * 0.08) * 1000;
        const hazardSpawnIntervalMs = Math.max(5.0, 12.0 - step * 1.0) * 1000;

        // Spawn first target quickly at 180ms so player has immediate action
        if (
          lastTargetSpawnMsRef.current === 0 ||
          activePlayElapsedMsRef.current - lastTargetSpawnMsRef.current >= targetSpawnIntervalMs
        ) {
          spawnEntity('target', activePlayElapsedMsRef.current, targetLifetimeMs);
          lastTargetSpawnMsRef.current = activePlayElapsedMsRef.current;
        }

        // Spawn hazard (first hazard at 3.5s in demo so users can see octagons quickly, then following interval)
        const hazardThreshold = lastHazardSpawnMsRef.current === 0 ? 3500 : hazardSpawnIntervalMs;
        if (activePlayElapsedMsRef.current - lastHazardSpawnMsRef.current >= hazardThreshold) {
          spawnEntity('hazard', activePlayElapsedMsRef.current, 2500);
          lastHazardSpawnMsRef.current = activePlayElapsedMsRef.current;
        }

        // Check entity expirations
        for (const entity of entitiesRef.current) {
          if (entity.isProcessed) continue;
          const ageMs = activePlayElapsedMsRef.current - entity.spawnTimeMs;
          if (ageMs >= entity.lifetimeMs) {
            entity.isProcessed = true;
            if (entity.type === 'target') {
              // Missed target costs 1 life
              livesRef.current = Math.max(0, livesRef.current - 1);
              setLives(livesRef.current);
              soundEngine.playLifeLossSweep();
              feedbacksRef.current.push({
                id: nextEntityIdRef.current++,
                x: entity.x,
                y: entity.y,
                text: 'MISSED -1♥',
                color: theme.hazard,
                createdAt: activePlayElapsedMsRef.current,
              });

              if (livesRef.current <= 0) {
                triggerNaturalGameOver();
                return;
              }
            } else {
              // Hazard natural expiry is safe (0 lives lost)
              feedbacksRef.current.push({
                id: nextEntityIdRef.current++,
                x: entity.x,
                y: entity.y,
                text: 'DODGED',
                color: theme.text,
                createdAt: activePlayElapsedMsRef.current,
              });
            }
          }
        }

        // Prune processed entities and old feedbacks
        entitiesRef.current = entitiesRef.current.filter((e) => !e.isProcessed);
        feedbacksRef.current = feedbacksRef.current.filter(
          (f) => activePlayElapsedMsRef.current - f.createdAt < 650
        );
        ripplesRef.current = ripplesRef.current.filter(
          (r) => activePlayElapsedMsRef.current - r.createdAt < 380
        );
      }

      // Draw Canvas Background
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = theme.background;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Subtle Swiss coordinate grid lines on playfield
      ctx.strokeStyle = `${theme.text}10`;
      ctx.lineWidth = 1;
      for (let gx = 40; gx < CANVAS_WIDTH; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, TOP_SAFE_ZONE);
        ctx.lineTo(gx, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let gy = TOP_SAFE_ZONE; gy < CANVAS_HEIGHT; gy += 40) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(CANVAS_WIDTH, gy);
        ctx.stroke();
      }

      // Top HUD safe zone divider line
      ctx.strokeStyle = `${theme.text}18`;
      ctx.beginPath();
      ctx.moveTo(16, TOP_SAFE_ZONE);
      ctx.lineTo(CANVAS_WIDTH - 16, TOP_SAFE_ZONE);
      ctx.stroke();

      // Render Ripples
      for (const ripple of ripplesRef.current) {
        const progress = Math.min(1, (activePlayElapsedMsRef.current - ripple.createdAt) / 380);
        ctx.save();
        ctx.strokeStyle = ripple.color;
        ctx.globalAlpha = Math.max(0, 1 - progress);
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ENTITY_RADIUS * (0.7 + progress * 0.9), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Render Active Entities
      for (const entity of entitiesRef.current) {
        if (entity.isProcessed) continue;
        const ageMs = activePlayElapsedMsRef.current - entity.spawnTimeMs;
        const remainingRatio = Math.max(0, 1 - ageMs / entity.lifetimeMs);

        if (entity.type === 'target') {
          // Outer shrinking lifetime ring
          const outerRadius = entity.radius + 4 + remainingRatio * 10;
          ctx.save();
          ctx.strokeStyle = theme.primary;
          ctx.globalAlpha = 0.45;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(
            entity.x,
            entity.y,
            outerRadius,
            -Math.PI / 2,
            -Math.PI / 2 + Math.PI * 2 * remainingRatio
          );
          ctx.stroke();
          ctx.restore();

          // Solid Circular Target (64.dp equivalent)
          ctx.save();
          ctx.fillStyle = theme.primary;
          ctx.beginPath();
          ctx.arc(entity.x, entity.y, entity.radius, 0, Math.PI * 2);
          ctx.fill();

          // Inner crisp white ring for tactile precision
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(entity.x, entity.y, entity.radius - 5, 0, Math.PI * 2);
          ctx.stroke();

          // +10 label inside target
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '700 12px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('+10', entity.x, entity.y);
          ctx.restore();
        } else {
          // Accessible Octagonal Hazard (Never color alone: Octagon + 3px contrasting outline + centered '!')
          ctx.save();
          const sides = 8;
          const r = entity.radius;
          ctx.beginPath();
          for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides - Math.PI / 8;
            const px = entity.x + r * Math.cos(angle);
            const py = entity.y + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fillStyle = theme.hazard;
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.strokeStyle = theme.text;
          ctx.stroke();

          // Bold '!' Warning Symbol inside Octagon
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('!', entity.x, entity.y + 1);
          ctx.restore();
        }
      }

      // Render Floating Hit / Miss Feedback
      for (const fb of feedbacksRef.current) {
        const progress = Math.min(1, (activePlayElapsedMsRef.current - fb.createdAt) / 650);
        ctx.save();
        ctx.fillStyle = fb.color;
        ctx.globalAlpha = 1 - progress;
        ctx.font = '700 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(fb.text, fb.x, fb.y - 18 - progress * 20);
        ctx.restore();
      }

      if (gameState === 'PLAYING') {
        rafIdRef.current = requestAnimationFrame(renderFrame);
      }
    };

    rafIdRef.current = requestAnimationFrame(renderFrame);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [gameState, triggerNaturalGameOver]);

  // Handle Canvas Pointer Down (Single-tap deduplicated hit detection)
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'PLAYING') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const tapX = (e.clientX - rect.left) * scaleX;
    const tapY = (e.clientY - rect.top) * scaleY;

    // Iterate top-most entity first
    for (let i = entitiesRef.current.length - 1; i >= 0; i--) {
      const entity = entitiesRef.current[i];
      if (entity.isProcessed) continue;

      const dist = Math.hypot(entity.x - tapX, entity.y - tapY);
      // Generous touch accessibility hit radius
      if (dist <= entity.radius + 8) {
        entity.isProcessed = true;

        if (entity.type === 'target') {
          const nextScore = scoreRef.current + 10;
          scoreRef.current = nextScore;
          setScore(nextScore);

          if (nextScore > 0 && nextScore % 50 === 0) {
            soundEngine.playScoreMilestone();
          } else {
            soundEngine.playTargetTap();
          }

          ripplesRef.current.push({
            id: nextEntityIdRef.current++,
            x: entity.x,
            y: entity.y,
            color: activeTheme.primary,
            createdAt: activePlayElapsedMsRef.current,
          });

          feedbacksRef.current.push({
            id: nextEntityIdRef.current++,
            x: entity.x,
            y: entity.y,
            text: '+10',
            color: activeTheme.primary,
            createdAt: activePlayElapsedMsRef.current,
          });
        } else {
          // Tapped an octagonal hazard -> -1 life
          livesRef.current = Math.max(0, livesRef.current - 1);
          setLives(livesRef.current);
          soundEngine.playHazardBuzz();

          ripplesRef.current.push({
            id: nextEntityIdRef.current++,
            x: entity.x,
            y: entity.y,
            color: activeTheme.hazard,
            createdAt: activePlayElapsedMsRef.current,
          });

          feedbacksRef.current.push({
            id: nextEntityIdRef.current++,
            x: entity.x,
            y: entity.y,
            text: 'HAZARD -1♥',
            color: activeTheme.hazard,
            createdAt: activePlayElapsedMsRef.current,
          });

          if (livesRef.current <= 0) {
            triggerNaturalGameOver();
          }
        }
        break;
      }
    }
  };

  const handlePause = () => {
    if (gameState === 'PLAYING') {
      soundEngine.stopAll();
      lastFrameTimeRef.current = null;
      setGameState('PAUSED');
    }
  };

  const handleResume = () => {
    if (gameState === 'PAUSED' || gameState === 'ABANDON_CONFIRM') {
      lastFrameTimeRef.current = performance.now();
      setGameState('PLAYING');
    }
  };

  const handleConfirmAbandonToHome = () => {
    soundEngine.stopAll();
    entitiesRef.current = [];
    setGameState('IDLE_APP');
    setAppTab('home');
  };

  const formatPlaytime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const handleUnlockOrEquipThemeInDemo = (theme: ThemePalette) => {
    const isOwned = stats.ownedThemeIds.includes(theme.id);
    if (isOwned) {
      onSelectTheme(theme);
      soundEngine.playTargetTap();
      return;
    }

    if (theme.currency === 'COINS') {
      if (stats.coins >= theme.priceAmount) {
        setStats((prev) => ({
          ...prev,
          coins: prev.coins - theme.priceAmount,
          ownedThemeIds: [...prev.ownedThemeIds, theme.id],
        }));
        onSelectTheme(theme);
        soundEngine.playScoreMilestone();
      } else {
        setAppTab('shop');
        setShopSubTab('coins');
      }
    } else if (theme.currency === 'DIAMONDS') {
      if (stats.diamonds >= theme.priceAmount) {
        setStats((prev) => ({
          ...prev,
          diamonds: prev.diamonds - theme.priceAmount,
          ownedThemeIds: [...prev.ownedThemeIds, theme.id],
        }));
        onSelectTheme(theme);
        soundEngine.playScoreMilestone();
      } else {
        setAppTab('shop');
        setShopSubTab('diamonds');
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Top Mode Switcher Control */}
      <div className="inline-flex items-center p-1 bg-[#F4F6F8] border border-slate-200 rounded-xl mb-4">
        <button
          type="button"
          onClick={() => setPhoneMode('interactive')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            phoneMode === 'interactive'
              ? 'bg-[#22252A] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Interactive Live Demo
        </button>
        <button
          type="button"
          onClick={() => setPhoneMode('screenshot')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            phoneMode === 'screenshot'
              ? 'bg-[#22252A] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Actual App Screen
        </button>
      </div>

      {/* Android Portrait Device Frame (360×640px outer geometry) */}
      <div
        className="relative w-[360px] h-[640px] rounded-[38px] p-[8px] bg-[#1E2229] shadow-xl border border-slate-800 select-none overflow-hidden"
        aria-label="Tap Arcade Android Phone Preview"
      >
        {/* Top Speaker Camera Cutout */}
        <div className="absolute top-[14px] left-1/2 -translate-x-1/2 z-30 w-16 h-1.5 rounded-full bg-slate-700/70 pointer-events-none" />

        {/* Inner Screen Viewport (344×624px) */}
        <div
          className="relative w-full h-full rounded-[30px] overflow-hidden flex flex-col transition-colors duration-200"
          style={{
            backgroundColor: phoneMode === 'interactive' ? activeTheme.background : '#FFFFFF',
            color: phoneMode === 'interactive' ? activeTheme.text : '#22252A',
          }}
        >
          {phoneMode === 'screenshot' ? (
            /* MODE 2: ACTUAL UNEDITED ANDROID SCREENSHOT VIEWER */
            <div className="relative w-full h-full flex flex-col bg-white">
              <div className="flex-1 relative overflow-hidden">
                <ResilientImage
                  src={rawScreens[rawScreenIndex]?.src || '/images/raw-home.png'}
                  fallbackSrc={rawScreens[rawScreenIndex]?.fallbackSrc}
                  alt={rawScreens[rawScreenIndex]?.title || 'Tap Arcade Screenshot'}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Bottom Screen Selector Bar */}
              <div className="bg-[#22252A]/95 text-white px-2.5 py-2 flex items-center justify-between gap-1 border-t border-slate-800">
                {['Home', 'Themes', 'Coins', 'Gems', 'Profile'].map((label, idx) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setRawScreenIndex(idx)}
                    className={`px-2 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                      rawScreenIndex === idx
                        ? 'bg-[#4A90E2] text-white font-semibold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* MODE 1: LIVE PLAYABLE HTML5 CANVAS & IN-APP SIMULATOR */
            <div className="relative w-full h-full flex flex-col">
              {/* Android Status Bar Simulation */}
              <div
                className="h-7 px-5 pt-1.5 flex items-center justify-between text-[11px] font-mono shrink-0 z-20"
                style={{ color: activeTheme.text }}
              >
                <span>10:26</span>
                <span className="opacity-75">60 FPS · {activeTheme.name}</span>
              </div>

              {gameState === 'IDLE_APP' ? (
                /* SIMULATED IN-APP SCREENS (HOME, THEMES, SHOP, PROFILE) */
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  {appTab === 'home' && (
                    <div className="flex-1 px-5 pt-3 pb-2 flex flex-col items-center justify-between overflow-y-auto">
                      {/* Currency Row */}
                      <div className="w-full flex items-center justify-center gap-4 mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setAppTab('shop');
                            setShopSubTab('coins');
                          }}
                          className="px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-mono font-semibold transition-transform active:scale-95 cursor-pointer"
                          style={{ backgroundColor: activeTheme.surface, color: activeTheme.text }}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full inline-block shrink-0"
                            style={{ backgroundColor: '#F59E0B' }}
                          />
                          <span className="tabular-nums">{stats.coins.toLocaleString()}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAppTab('shop');
                            setShopSubTab('diamonds');
                          }}
                          className="px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-mono font-semibold transition-transform active:scale-95 cursor-pointer"
                          style={{ backgroundColor: activeTheme.surface, color: activeTheme.text }}
                        >
                          <span
                            className="w-3.5 h-3.5 rotate-45 inline-block shrink-0"
                            style={{ backgroundColor: '#38BDF8' }}
                          />
                          <span className="tabular-nums">{stats.diamonds.toLocaleString()}</span>
                        </button>
                      </div>

                      {/* Equipped Theme & Personal Best */}
                      <div className="flex flex-col items-center gap-2 my-1">
                        <button
                          type="button"
                          onClick={() => setAppTab('themes')}
                          className="px-3.5 py-1 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer"
                          style={{ backgroundColor: activeTheme.surface, color: activeTheme.text }}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{ backgroundColor: activeTheme.primary }}
                          />
                          <span>Theme: {activeTheme.name}</span>
                        </button>
                        <p className="text-base font-bold font-mono tabular-nums">
                          Best: {stats.personalBest.toLocaleString()}
                        </p>
                      </div>

                      {/* Prominent Circular PLAY Button */}
                      <button
                        type="button"
                        onClick={startNewRun}
                        className="w-32 h-32 rounded-full flex flex-col items-center justify-center text-white font-bold text-xl tracking-wide shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer my-1"
                        style={{ backgroundColor: activeTheme.primary }}
                        aria-label="Start Playable Tap Arcade Run"
                      >
                        <span>PLAY</span>
                        <span className="text-[10px] font-mono font-normal opacity-90 mt-0.5">
                          TAP TO START
                        </span>
                      </button>

                      {/* How to Play 3-Bullet Rules Summary */}
                      <div
                        className="w-full rounded-2xl p-3.5 text-left space-y-1.5"
                        style={{ backgroundColor: activeTheme.surface, color: activeTheme.text }}
                      >
                        <p className="text-xs font-bold">How to Play</p>
                        <ul className="text-[11px] leading-relaxed space-y-1 opacity-90">
                          <li>• Tap circles to score 10 pts each — earn 1 coin per point on completed runs</li>
                          <li>• Avoid (and don&apos;t tap!) octagonal ! warning hazards</li>
                          <li>• Miss a target or tap a hazard = lose 1 life (3 lives total)</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {appTab === 'themes' && (
                    <div className="flex-1 px-4 pt-2 pb-2 flex flex-col overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold">Themes</h4>
                        <span className="text-[11px] font-mono opacity-75">
                          {stats.ownedThemeIds.length} / 13 Unlocked
                        </span>
                      </div>

                      {/* Category Tabs */}
                      <div className="grid grid-cols-3 border-b border-slate-200/60 text-xs font-semibold mb-2.5">
                        {(['Free', 'Coin', 'Premium'] as const).map((tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setThemeSubTab(tab)}
                            className={`py-1.5 text-center border-b-2 transition-colors cursor-pointer ${
                              themeSubTab === tab
                                ? 'border-[#4A90E2] font-bold'
                                : 'border-transparent opacity-60'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      {/* Scrollable Theme List inside Phone */}
                      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
                        {ALL_THEMES.filter((t) => t.category === themeSubTab).map((t) => {
                          const isOwned = stats.ownedThemeIds.includes(t.id);
                          const isEquipped = activeTheme.id === t.id;
                          return (
                            <div
                              key={t.id}
                              className="p-3 rounded-xl flex flex-col gap-2"
                              style={{ backgroundColor: activeTheme.surface }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  {[t.background, t.surface, t.primary, t.hazard, t.text].map(
                                    (hex, i) => (
                                      <span
                                        key={i}
                                        className="w-3.5 h-3.5 rounded-full border border-black/10"
                                        style={{ backgroundColor: hex }}
                                      />
                                    )
                                  )}
                                </div>
                                <span className="text-[11px] font-mono opacity-80">
                                  {t.priceLabel}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold">{t.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleUnlockOrEquipThemeInDemo(t)}
                                  className="px-3 py-1 rounded-lg text-[11px] font-semibold text-white transition-opacity cursor-pointer"
                                  style={{
                                    backgroundColor: isEquipped
                                      ? '#64748B'
                                      : activeTheme.primary,
                                  }}
                                >
                                  {isEquipped
                                    ? 'Equipped'
                                    : isOwned
                                    ? 'Apply Theme'
                                    : `Unlock (${t.priceLabel})`}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {appTab === 'shop' && (
                    <div className="flex-1 px-4 pt-2 pb-2 flex flex-col overflow-hidden">
                      <h4 className="text-sm font-bold mb-2">Shop</h4>
                      <div className="grid grid-cols-2 border-b border-slate-200/60 text-xs font-semibold mb-3">
                        <button
                          type="button"
                          onClick={() => setShopSubTab('coins')}
                          className={`py-1.5 text-center border-b-2 cursor-pointer ${
                            shopSubTab === 'coins'
                              ? 'border-[#4A90E2] font-bold'
                              : 'border-transparent opacity-60'
                          }`}
                        >
                          Coins
                        </button>
                        <button
                          type="button"
                          onClick={() => setShopSubTab('diamonds')}
                          className={`py-1.5 text-center border-b-2 cursor-pointer ${
                            shopSubTab === 'diamonds'
                              ? 'border-[#4A90E2] font-bold'
                              : 'border-transparent opacity-60'
                          }`}
                        >
                          Diamonds
                        </button>
                      </div>

                      {shopSubTab === 'coins' ? (
                        <div className="flex-1 flex flex-col justify-between text-center py-2">
                          <div>
                            <p className="text-2xl font-bold font-mono tabular-nums">
                              {stats.coins.toLocaleString()}
                            </p>
                            <p className="text-xs opacity-75">Local Coins</p>
                          </div>

                          <div
                            className="p-3 rounded-xl text-left text-xs leading-relaxed"
                            style={{ backgroundColor: activeTheme.surface }}
                          >
                            Coins are earned strictly in-game — 1 coin per point scored in completed runs.
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setAppTab('themes');
                              setThemeSubTab('Coin');
                            }}
                            className="w-full py-2.5 rounded-xl border border-current/25 text-xs font-semibold cursor-pointer"
                          >
                            Browse Coin Themes →
                          </button>

                          <div
                            className="p-3 rounded-xl text-left text-[11px] leading-relaxed opacity-85"
                            style={{ backgroundColor: activeTheme.surface }}
                          >
                            Coins, Coin Themes, and Statistics are stored locally on this device.
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col overflow-y-auto space-y-2 pr-0.5">
                          <div className="text-center mb-1">
                            <p className="text-xl font-bold font-mono tabular-nums">
                              {stats.diamonds.toLocaleString()}
                            </p>
                            <p className="text-[11px] opacity-75">Account-Synced Diamonds (Demo Sandbox)</p>
                          </div>
                          {[
                            { amount: 70, label: 'Starter Pouch', refPrice: '$0.99' },
                            { amount: 150, label: 'Reflex Pack', refPrice: '$1.99' },
                            { amount: 400, label: 'Arcade Bundle', refPrice: '$4.99' },
                            { amount: 800, label: 'Theme Vault', refPrice: '$9.99' },
                          ].map((pack) => (
                            <div
                              key={pack.amount}
                              className="p-2.5 rounded-xl flex items-center justify-between"
                              style={{ backgroundColor: activeTheme.surface }}
                            >
                              <div>
                                <p className="text-xs font-bold font-mono tabular-nums">
                                  {pack.amount.toLocaleString()} Diamonds
                                </p>
                                <p className="text-[10px] opacity-75">{pack.label}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setStats((prev) => ({
                                    ...prev,
                                    diamonds: prev.diamonds + pack.amount,
                                  }));
                                  soundEngine.playScoreMilestone();
                                }}
                                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white cursor-pointer"
                                style={{ backgroundColor: activeTheme.primary }}
                              >
                                Test +{pack.amount} ({pack.refPrice})
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {appTab === 'profile' && (
                    <div className="flex-1 px-4 pt-2 pb-2 flex flex-col justify-between overflow-y-auto">
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold">Profile</h4>
                        <div
                          className="p-3.5 rounded-xl space-y-2 text-xs"
                          style={{ backgroundColor: activeTheme.surface }}
                        >
                          <div className="flex justify-between">
                            <span className="opacity-80">Personal Best</span>
                            <span className="font-mono font-bold tabular-nums">
                              {stats.personalBest.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-80">Completed Games</span>
                            <span className="font-mono font-bold tabular-nums">
                              {stats.completedGames}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-80">Total Playtime</span>
                            <span className="font-mono font-bold tabular-nums">
                              {formatPlaytime(stats.totalPlaytimeSeconds)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-80">Owned Themes</span>
                            <span className="font-mono font-bold tabular-nums">
                              {stats.ownedThemeIds.length} / 13
                            </span>
                          </div>
                        </div>

                        {/* Sound Preference */}
                        <div className="flex items-center justify-between py-1">
                          <div>
                            <p className="text-xs font-bold">Sound Effects</p>
                            <p className="text-[11px] opacity-75">
                              6 procedural Web Audio cues
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={toggleSound}
                            className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                              soundEnabled ? 'bg-[#4A90E2]' : 'bg-slate-300'
                            }`}
                            aria-label="Toggle Sound Effects"
                          >
                            <span
                              className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                soundEnabled ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <div
                          className="p-3 rounded-xl text-[11px] leading-relaxed opacity-85"
                          style={{ backgroundColor: activeTheme.surface }}
                        >
                          Coins, Coin Themes, and Statistics are stored locally on this device.
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setStats(DEFAULT_STATS);
                          onSelectTheme(ALL_THEMES[0]);
                        }}
                        className="w-full py-2 rounded-xl border border-current/20 text-xs font-semibold cursor-pointer mt-2"
                      >
                        Reset Demo Sandbox Data
                      </button>
                    </div>
                  )}

                  {/* In-App Bottom Navigation Bar */}
                  <div
                    className="h-14 px-3 flex items-center justify-around border-t border-black/5 shrink-0"
                    style={{ backgroundColor: activeTheme.surface }}
                  >
                    {[
                      { id: 'home', label: 'Home', icon: HomeIcon },
                      { id: 'themes', label: 'Themes', icon: Palette },
                      { id: 'shop', label: 'Shop', icon: ShoppingCart },
                      { id: 'profile', label: 'Profile', icon: User },
                    ].map((nav) => {
                      const IconComp = nav.icon;
                      const active = appTab === nav.id;
                      return (
                        <button
                          key={nav.id}
                          type="button"
                          onClick={() => setAppTab(nav.id as AppTab)}
                          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors cursor-pointer"
                          style={{
                            color: activeTheme.text,
                            opacity: active ? 1 : 0.6,
                          }}
                        >
                          <IconComp className="w-4 h-4 mb-0.5" />
                          <span className="text-[10px] font-semibold">{nav.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* ACTIVE GAMEPLAY / COUNTDOWN / PAUSE / GAME OVER CANVAS VIEW */
                <div className="relative flex-1 w-full h-full overflow-hidden">
                  {/* Top Gameplay HUD (3 Hearts Top-Left, Score Top-Center, Mute & Pause Top-Right) */}
                  <div className="absolute top-0 left-0 right-0 h-[56px] px-3.5 flex items-center justify-between z-20 pointer-events-auto">
                    {/* 3 Heart Icons */}
                    <div className="flex items-center gap-1" aria-label={`${lives} lives remaining`}>
                      {[1, 2, 3].map((heartIndex) => {
                        const filled = heartIndex <= lives;
                        return (
                          <Heart
                            key={heartIndex}
                            className="w-5 h-5 transition-transform duration-150"
                            style={{
                              color: filled ? activeTheme.hazard : activeTheme.text,
                              fill: filled ? activeTheme.hazard : 'transparent',
                              opacity: filled ? 1 : 0.3,
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Tabular Score Counter */}
                    <div className="flex flex-col items-center">
                      <span
                        className="text-xl font-extrabold font-mono tabular-nums tracking-tight"
                        style={{ color: activeTheme.text }}
                      >
                        {score.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono tabular-nums opacity-65">
                        {elapsedSeconds}s · Step {Math.floor(elapsedSeconds / 30)}
                      </span>
                    </div>

                    {/* Mute/Unmute & Pause Buttons (Accessible Touch Targets) */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={toggleSound}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                        style={{ backgroundColor: activeTheme.surface, color: activeTheme.text }}
                        aria-label={soundEnabled ? 'Mute game audio' : 'Unmute game audio'}
                      >
                        {soundEnabled ? (
                          <Volume2 className="w-4 h-4" />
                        ) : (
                          <VolumeX className="w-4 h-4 opacity-60" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handlePause}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                        style={{ backgroundColor: activeTheme.surface, color: activeTheme.text }}
                        aria-label="Pause game"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Interactive 60 FPS HTML5 Canvas */}
                  <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}
                    onPointerDown={handleCanvasPointerDown}
                    className="w-full h-full block cursor-crosshair touch-none"
                  />

                  {/* OVERLAY 1: 3 -> 2 -> 1 -> Go! Pre-Game Countdown */}
                  {gameState === 'COUNTDOWN' && (
                    <div
                      className="absolute inset-0 z-30 flex flex-col items-center justify-center backdrop-blur-[2px]"
                      style={{ backgroundColor: `${activeTheme.background}D9` }}
                    >
                      <p className="text-xs font-mono uppercase tracking-widest opacity-70 mb-2">
                        Get Ready
                      </p>
                      <span
                        className="text-6xl font-extrabold font-mono tabular-nums"
                        style={{ color: activeTheme.primary }}
                      >
                        {countdownStep}
                      </span>
                      <p className="text-xs mt-4 opacity-80 px-6 text-center">
                        Tap circles (+10) · Ignore octagons (!)
                      </p>
                    </div>
                  )}

                  {/* OVERLAY 2: Pause Modal */}
                  {gameState === 'PAUSED' && (
                    <div className="absolute inset-0 z-30 bg-black/55 backdrop-blur-xs flex items-center justify-center p-5">
                      <div
                        className="w-full rounded-2xl p-5 shadow-lg space-y-3 text-center"
                        style={{ backgroundColor: activeTheme.background, color: activeTheme.text }}
                      >
                        <h4 className="text-lg font-bold">Game Paused</h4>
                        <p className="text-xs opacity-75 font-mono tabular-nums">
                          Current Score: {score.toLocaleString()}
                        </p>
                        <div className="space-y-2 pt-1">
                          <button
                            type="button"
                            onClick={handleResume}
                            className="w-full py-2.5 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-2 cursor-pointer"
                            style={{ backgroundColor: activeTheme.primary }}
                          >
                            <Play className="w-4 h-4" />
                            <span>Resume</span>
                          </button>
                          <button
                            type="button"
                            onClick={startNewRun}
                            className="w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                            style={{ backgroundColor: activeTheme.surface, color: activeTheme.text }}
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Restart (3, 2, 1, Go!)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setGameState('ABANDON_CONFIRM')}
                            className="w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border border-current/15 cursor-pointer"
                          >
                            <HomeIcon className="w-4 h-4" />
                            <span>Home</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OVERLAY 3: Abandon Run Confirmation Dialog */}
                  {gameState === 'ABANDON_CONFIRM' && (
                    <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex items-center justify-center p-5">
                      <div
                        className="w-full rounded-2xl p-5 shadow-lg space-y-3 text-center"
                        style={{ backgroundColor: activeTheme.background, color: activeTheme.text }}
                      >
                        <AlertTriangle
                          className="w-7 h-7 mx-auto"
                          style={{ color: activeTheme.hazard }}
                        />
                        <h4 className="text-base font-bold">Abandon Current Run?</h4>
                        <p className="text-xs opacity-80 leading-relaxed">
                          Coins are only awarded when a run completes naturally. Returning Home now awards 0 coins.
                        </p>
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <button
                            type="button"
                            onClick={handleResume}
                            className="py-2.5 rounded-xl font-semibold text-xs cursor-pointer"
                            style={{ backgroundColor: activeTheme.surface }}
                          >
                            Keep Playing
                          </button>
                          <button
                            type="button"
                            onClick={handleConfirmAbandonToHome}
                            className="py-2.5 rounded-xl font-semibold text-xs text-white cursor-pointer"
                            style={{ backgroundColor: activeTheme.hazard }}
                          >
                            End Run
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OVERLAY 4: Natural Game Over Result Card */}
                  {gameState === 'GAME_OVER' && (
                    <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex items-center justify-center p-5">
                      <div
                        className="w-full rounded-2xl p-5 shadow-lg space-y-3 text-center"
                        style={{ backgroundColor: activeTheme.background, color: activeTheme.text }}
                      >
                        <p className="text-xs font-mono uppercase tracking-wider opacity-70">
                          Run Complete
                        </p>
                        <h4 className="text-xl font-extrabold">Game Over</h4>

                        {isNewPersonalBest && (
                          <p
                            className="text-xs font-bold font-mono flex items-center justify-center gap-1"
                            style={{ color: activeTheme.primary }}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>New Personal Best!</span>
                          </p>
                        )}

                        <div
                          className="rounded-xl p-3 space-y-1.5 text-xs"
                          style={{ backgroundColor: activeTheme.surface }}
                        >
                          <div className="flex justify-between">
                            <span className="opacity-75">Final Score</span>
                            <span className="font-mono font-bold tabular-nums">
                              {finalScore.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-75">Coins Earned</span>
                            <span
                              className="font-mono font-bold tabular-nums"
                              style={{ color: activeTheme.primary }}
                            >
                              +{animatedCoinsEarned.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-black/10">
                            <span className="opacity-75">Local Coin Balance</span>
                            <span className="font-mono font-bold tabular-nums">
                              {stats.coins.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 pt-1">
                          <button
                            type="button"
                            onClick={startNewRun}
                            className="w-full py-2.5 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-1.5 cursor-pointer"
                            style={{ backgroundColor: activeTheme.primary }}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restart</span>
                          </button>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setGameState('IDLE_APP');
                                setAppTab('home');
                              }}
                              className="py-2 rounded-xl font-semibold text-xs cursor-pointer"
                              style={{ backgroundColor: activeTheme.surface }}
                            >
                              Home
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setGameState('IDLE_APP');
                                setAppTab('profile');
                              }}
                              className="py-2 rounded-xl font-semibold text-xs cursor-pointer"
                              style={{ backgroundColor: activeTheme.surface }}
                            >
                              View Statistics
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Theme Bar below phone so visitors can test palettes right in the hero */}
      <div className="mt-3 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>Active Theme: {activeTheme.name}</span>
          <span aria-hidden="true">·</span>
          <span>{activeTheme.primary}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {ALL_THEMES.slice(0, 7).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTheme(t)}
              title={`Preview ${t.name} theme`}
              className={`w-6 h-6 rounded-full border transition-transform cursor-pointer ${
                activeTheme.id === t.id
                  ? 'scale-110 ring-2 ring-offset-2 ring-[#22252A]'
                  : 'opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: t.primary, borderColor: t.text }}
              aria-label={`Select ${t.name} theme`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
