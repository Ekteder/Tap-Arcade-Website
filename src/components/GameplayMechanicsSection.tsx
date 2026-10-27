import React, { useState } from 'react';
import { Volume2, Play, ShieldAlert, Crosshair, Sliders, LayoutGrid } from 'lucide-react';
import { SOUND_CUE_SPECS, SoundCueSpec, ThemePalette } from '../data/tapArcadeData';
import { soundEngine } from '../utils/soundEngine';

interface GameplayMechanicsSectionProps {
  activeTheme: ThemePalette;
}

export const GameplayMechanicsSection: React.FC<GameplayMechanicsSectionProps> = ({
  activeTheme,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(60);
  const [activeCueId, setActiveCueId] = useState<string | null>(null);

  // Exact DifficultyCalculator.kt mathematical formulas
  const step = Math.floor(elapsedSeconds / 30);
  const targetLifetime = Math.max(0.8, Number((2.0 - step * 0.15).toFixed(2)));
  const targetSpawnDelay = Math.max(0.6, Number((1.2 - step * 0.08).toFixed(2)));
  const hazardSpawnDelay = Math.max(5.0, Number((12.0 - step * 1.0).toFixed(1)));

  const triggerCuePreview = (cue: SoundCueSpec) => {
    setActiveCueId(cue.id);
    switch (cue.id) {
      case 'target_tap':
        soundEngine.playTargetTap(true);
        break;
      case 'score_milestone':
        soundEngine.playScoreMilestone(true);
        break;
      case 'hazard_buzz':
        soundEngine.playHazardBuzz(true);
        break;
      case 'life_loss':
        soundEngine.playLifeLossSweep(true);
        break;
      case 'countdown_tick':
        soundEngine.playCountdownTick(true, true);
        break;
      case 'game_over':
        soundEngine.playGameOverArpeggio(true);
        break;
    }
    window.setTimeout(() => {
      setActiveCueId((prev) => (prev === cue.id ? null : prev));
    }, 450);
  };

  return (
    <section id="gameplay" className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-mono text-slate-500 mb-2">
            02. Core Engine Mechanics · 60 FPS withFrameNanos Loop
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-[#22252A] text-balance">
            Deterministic Spatial Rules &amp; Accessible Shape Coding
          </h2>
          <p className="text-base text-slate-600 mt-2 leading-relaxed">
            Built with Jetpack Compose Canvas on Android, Tap Arcade enforces strict anti-cluster geometry,
            non-color-dependent hazard signaling, and a deterministic 30-second difficulty step curve.
          </p>
        </div>

        {/* 3-Card Bento Grid: Targets, Octagonal Hazards, Anti-Cluster Spatial Math */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Circular Targets */}
          <div className="bg-[#F4F6F8] rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-slate-500">
                  Entity 01 · Valid Target
                </span>
                <Crosshair className="w-4 h-4 text-[#4A90E2]" />
              </div>

              {/* Visual Target Diagram */}
              <div className="h-36 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-6 relative">
                <div className="relative flex items-center justify-center">
                  {/* Shrinking Outer Ring */}
                  <div
                    className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center"
                    style={{ borderColor: activeTheme.primary }}
                  >
                    {/* 64.dp Circle */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs"
                      style={{ backgroundColor: activeTheme.primary }}
                    >
                      +10
                    </div>
                  </div>
                </div>
                <span className="absolute bottom-2.5 right-3 text-[11px] font-mono text-slate-500">
                  64.dp Diameter · 2.0s Base Ring
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#22252A]">
                Circular Targets (+10 Pts &amp; +1 Coin)
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Each target spawns with an outer lifetime arc that shrinks to zero. Tapping before expiry awards{' '}
                <strong className="text-[#22252A]">10 points</strong> (and 1 local coin on completed runs). Missing an expiring target deducts{' '}
                <strong className="text-[#22252A]">1 life</strong>.
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Max Simultaneous: 4</span>
              <span>Single-Tap Deduplicated</span>
            </div>
          </div>

          {/* Card 2: Accessible Octagonal Hazards */}
          <div className="bg-[#F4F6F8] rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-slate-500">
                  Entity 02 · Warning Hazard
                </span>
                <ShieldAlert className="w-4 h-4 text-[#D9381E]" />
              </div>

              {/* Visual Octagon Diagram */}
              <div className="h-36 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-6 relative">
                <svg width="76" height="76" viewBox="0 0 80 80" aria-label="Octagonal Hazard Symbol">
                  <polygon
                    points="26,6 54,6 74,26 74,54 54,74 26,74 6,54 6,26"
                    fill={activeTheme.hazard}
                    stroke={activeTheme.text}
                    strokeWidth="4"
                  />
                  <text
                    x="40"
                    y="48"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="28"
                    fontWeight="800"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    !
                  </text>
                </svg>
                <span className="absolute bottom-2.5 right-3 text-[11px] font-mono text-slate-500">
                  Octagon + 3.dp Stroke + !
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#22252A]">
                Accessible Octagonal Hazards
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Never relies on color alone. Hazards are regular octagons with a contrasting{' '}
                <code className="font-mono text-xs">3.dp</code> outline and centered{' '}
                <code className="font-mono text-xs">!</code> glyph. Tapping costs{' '}
                <strong className="text-[#22252A]">1 life</strong>; letting them expire naturally after 2.5s costs{' '}
                <strong className="text-[#22252A]">0 lives</strong>.
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Natural Expiry: 2.5s (Safe)</span>
              <span>WCAG Shape-Coded</span>
            </div>
          </div>

          {/* Card 3: Anti-Cluster Spawning Geometry */}
          <div className="bg-[#F4F6F8] rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-slate-500">
                  Spatial Invariants · Anti-Overlap
                </span>
                <LayoutGrid className="w-4 h-4 text-[#10B981]" />
              </div>

              {/* Spatial Safe Zone Diagram */}
              <div className="h-36 rounded-xl bg-white border border-slate-200 p-3 flex flex-col justify-between mb-6 font-mono text-[11px]">
                <div className="bg-slate-100 rounded px-2.5 py-1 flex justify-between text-slate-600 border border-slate-200">
                  <span>Top HUD Safe Zone</span>
                  <span>&ge; 96.dp</span>
                </div>
                <div className="flex-1 my-1.5 border border-dashed border-slate-300 rounded flex items-center justify-around px-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full inline-block"
                      style={{ backgroundColor: activeTheme.primary }}
                    />
                    <span className="text-slate-500">&larr; &ge; 88.dp &rarr;</span>
                    <span
                      className="w-6 h-6 rotate-45 inline-block rounded-xs"
                      style={{ backgroundColor: activeTheme.hazard }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-slate-500 px-1">
                  <span>Side/Bottom Padding: 48.dp</span>
                  <span>Cap: 4 + 4</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#22252A]">
                Intelligent Anti-Cluster Spawning
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Every candidate spawn coordinate is validated against active entities to guarantee at least{' '}
                <code className="font-mono text-xs">88.dp</code> center-to-center separation, preventing unfair overlapping targets or accidental hazard traps.
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Interruption Policy: Instant Halt</span>
              <span>0 Pause Exploits</span>
            </div>
          </div>
        </div>

        {/* Interactive Difficulty Progression Calculator + Procedural Audio Lab (2-Column Asymmetric Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left 7 Columns: Interactive Difficulty Progression Calculator */}
          <div className="lg:col-span-7 bg-[#F4F6F8] rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-mono text-slate-500">
                  Interactive Engine Simulator · DifficultyCalculator.kt
                </span>
                <Sliders className="w-4 h-4 text-[#4A90E2]" />
              </div>
              <h3 className="text-xl font-bold text-[#22252A]">
                Live Difficulty Progression Calculator
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Drag the active gameplay timer to inspect how target lifetimes and spawn intervals tighten every 30 seconds until hitting their hard safety floors.
              </p>

              {/* Slider Control */}
              <div className="mt-6 bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="elapsed-time-slider"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Active Gameplay Elapsed Time
                  </label>
                  <div className="text-sm font-mono font-bold text-[#22252A] tabular-nums">
                    {elapsedSeconds}s · Step {step} (floor({elapsedSeconds} / 30))
                  </div>
                </div>

                <input
                  id="elapsed-time-slider"
                  type="range"
                  min={0}
                  max={240}
                  step={5}
                  value={elapsedSeconds}
                  onChange={(e) => setElapsedSeconds(Number(e.target.value))}
                  className="w-full accent-[#4A90E2] cursor-pointer h-2 bg-slate-200 rounded-lg"
                />

                {/* Preset Step Buttons */}
                <div className="flex items-center justify-between gap-1.5 mt-3 flex-wrap">
                  {[0, 30, 60, 90, 120, 180, 240].map((presetSec) => (
                    <button
                      key={presetSec}
                      type="button"
                      onClick={() => setElapsedSeconds(presetSec)}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono tabular-nums transition-colors cursor-pointer ${
                        elapsedSeconds === presetSec
                          ? 'bg-[#22252A] text-white font-semibold'
                          : 'bg-[#F4F6F8] text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {presetSec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Real-Time Calculated Engine Outputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Target Lifetime</p>
                  <p className="text-2xl font-extrabold font-mono tabular-nums text-[#22252A] mt-1">
                    {targetLifetime.toFixed(2)}s
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 mt-2">
                    max(0.8s, 2.0s - {step}×0.15s)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {targetLifetime <= 0.8 ? 'Safety floor reached (0.80s)' : 'Shrinking ring window'}
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Target Spawn Delay</p>
                  <p className="text-2xl font-extrabold font-mono tabular-nums text-[#4A90E2] mt-1">
                    {targetSpawnDelay.toFixed(2)}s
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 mt-2">
                    max(0.6s, 1.2s - {step}×0.08s)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {targetSpawnDelay <= 0.6 ? 'Safety floor reached (0.60s)' : 'Interval between circles'}
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Hazard Spawn Delay</p>
                  <p className="text-2xl font-extrabold font-mono tabular-nums text-[#D9381E] mt-1">
                    {hazardSpawnDelay.toFixed(1)}s
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 mt-2">
                    max(5.0s, 12.0s - {step}×1.0s)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {hazardSpawnDelay <= 5.0 ? 'Safety floor reached (5.0s)' : 'Interval between octagons'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500">
              <span>Starting Lives: 3 Hearts</span>
              <span>Reward Ratio: 10 Pts = 10 Local Coins</span>
              <span>Completed Runs Only</span>
            </div>
          </div>

          {/* Right 5 Columns: Procedural Sound Synthesizer Audition Panel */}
          <div className="lg:col-span-5 bg-[#F4F6F8] rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-mono text-slate-500">
                  Zero-Binary AudioTrack PCM · SoundSynthesizer.kt
                </span>
                <Volume2 className="w-4 h-4 text-[#4A90E2]" />
              </div>
              <h3 className="text-xl font-bold text-[#22252A]">
                6 Procedural Audio Cues
              </h3>
              <p className="text-sm text-slate-600 mt-1 mb-5">
                Tap Arcade synthesizes all 6 sound effects mathematically in memory with zero external{' '}
                <code className="font-mono text-xs">.wav</code> or{' '}
                <code className="font-mono text-xs">.ogg</code> assets. Click any cue below to audition its live waveform:
              </p>

              <div className="space-y-2.5">
                {SOUND_CUE_SPECS.map((cue) => {
                  const isPlaying = activeCueId === cue.id;
                  return (
                    <button
                      key={cue.id}
                      type="button"
                      onClick={() => triggerCuePreview(cue)}
                      className={`w-full text-left p-3 rounded-xl border transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                        isPlaying
                          ? 'bg-[#22252A] text-white border-[#22252A]'
                          : 'bg-white text-[#22252A] border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold truncate">{cue.name}</span>
                          <span
                            className={`text-[11px] font-mono ${
                              isPlaying ? 'text-sky-300' : 'text-[#4A90E2]'
                            }`}
                          >
                            {cue.frequencySpec}
                          </span>
                        </div>
                        <p
                          className={`text-[11px] truncate mt-0.5 ${
                            isPlaying ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {cue.trigger}
                        </p>
                      </div>
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isPlaying ? 'bg-white/15 text-white' : 'bg-[#F4F6F8] text-[#22252A]'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-slate-200/80 text-xs font-mono text-slate-500">
              Audio halts immediately on Pause, Interruption, or Game Over.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
