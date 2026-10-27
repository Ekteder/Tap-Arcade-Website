import React, { useState } from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import { ALL_THEMES, ThemePalette } from '../data/tapArcadeData';
import { soundEngine } from '../utils/soundEngine';

interface ThemeStudioSectionProps {
  activeTheme: ThemePalette;
  onSelectTheme: (theme: ThemePalette) => void;
  onJumpToHeroDemo: () => void;
}

export const ThemeStudioSection: React.FC<ThemeStudioSectionProps> = ({
  activeTheme,
  onSelectTheme,
  onJumpToHeroDemo,
}) => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'Free' | 'Coin' | 'Premium'>('ALL');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const visibleThemes =
    filterCategory === 'ALL'
      ? ALL_THEMES
      : ALL_THEMES.filter((t) => t.category === filterCategory);

  const handleCopyHex = (e: React.MouseEvent, hex: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopiedHex(hex);
    window.setTimeout(() => {
      setCopiedHex((prev) => (prev === hex ? null : prev));
    }, 1400);
  };

  return (
    <section id="themes" className="py-20 bg-[#F4F6F8] border-y border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-mono text-slate-500 mb-2">
              03. Accessible Color Engineering · 13 Curated Light-Mode Palettes
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#22252A] text-balance">
              Interactive 13-Theme Studio &amp; Live Palette Switcher
            </h2>
            <p className="text-base text-slate-600 mt-2 max-w-2xl">
              Select any theme card below to bind its exact 5-color palette (Background, Surface,
              Primary Target, Hazard Fill, Text/HUD) to the live playable phone demo.
            </p>
          </div>

          <div
            className="inline-flex flex-wrap items-center gap-1 p-1.5 bg-white border border-slate-200 rounded-xl shrink-0"
            role="tablist"
            aria-label="Filter themes by tier"
          >
            {[
              { id: 'ALL', label: 'All (13)' },
              { id: 'Free', label: 'Free (1)' },
              { id: 'Coin', label: 'Coin Tier (3)' },
              { id: 'Premium', label: 'Premium Tier (9)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={filterCategory === tab.id}
                onClick={() => setFilterCategory(tab.id as 'ALL' | 'Free' | 'Coin' | 'Premium')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterCategory === tab.id
                    ? 'bg-[#22252A] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl border border-slate-200 p-6 md:p-8 mb-8 transition-colors duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          style={{
            backgroundColor: activeTheme.background,
            color: activeTheme.text,
          }}
        >
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono opacity-80">
              <span>Active Live Theme: {activeTheme.name}</span>
              <span aria-hidden="true">·</span>
              <span>{activeTheme.category} Tier</span>
              <span aria-hidden="true">·</span>
              <span>{activeTheme.priceLabel}</span>
            </div>
            <h3 className="text-2xl font-bold">{activeTheme.name} Palette Preview</h3>
            <p className="text-sm opacity-85 leading-relaxed">{activeTheme.contrastNote}</p>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <div
              className="px-5 py-3.5 rounded-xl flex items-center gap-5 border border-black/10"
              style={{ backgroundColor: activeTheme.surface }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-mono text-xs font-bold shadow-xs"
                  style={{ backgroundColor: activeTheme.primary }}
                >
                  +10
                </span>
                <div className="text-xs font-mono">
                  <p className="font-bold">Target</p>
                  <p className="opacity-75">{activeTheme.primary}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <svg width="40" height="40" viewBox="0 0 80 80" aria-hidden="true">
                  <polygon
                    points="26,6 54,6 74,26 74,54 54,74 26,74 6,54 6,26"
                    fill={activeTheme.hazard}
                    stroke={activeTheme.text}
                    strokeWidth="5"
                  />
                  <text
                    x="40"
                    y="50"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="32"
                    fontWeight="800"
                  >
                    !
                  </text>
                </svg>
                <div className="text-xs font-mono">
                  <p className="font-bold">Hazard</p>
                  <p className="opacity-75">{activeTheme.hazard}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onJumpToHeroDemo}
              className="px-4 py-3 rounded-xl text-xs font-semibold text-white flex items-center gap-2 transition-opacity hover:opacity-95 cursor-pointer whitespace-nowrap shrink-0"
              style={{ backgroundColor: activeTheme.primary }}
            >
              <span>Play With {activeTheme.name} Theme</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleThemes.map((theme) => {
            const isSelected = activeTheme.id === theme.id;
            const swatches = [
              { label: 'BG', hex: theme.background },
              { label: 'Surface', hex: theme.surface },
              { label: 'Primary', hex: theme.primary },
              { label: 'Hazard', hex: theme.hazard },
              { label: 'Text', hex: theme.text },
            ];

            return (
              <div
                key={theme.id}
                onClick={() => {
                  onSelectTheme(theme);
                  soundEngine.playTargetTap();
                }}
                className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#22252A] ring-2 ring-[#22252A]/15'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
                    <span>
                      {theme.category} Tier · {theme.priceLabel}
                    </span>
                    <span className="font-semibold text-[#22252A]">
                      {isSelected ? 'Equipped in Demo' : 'Click to Preview'}
                    </span>
                  </div>

                  <div
                    className="rounded-xl p-4 mb-4 border border-black/10 flex items-center justify-between"
                    style={{ backgroundColor: theme.background, color: theme.text }}
                  >
                    <div>
                      <h3 className="text-lg font-bold">{theme.name}</h3>
                      <p className="text-xs font-mono opacity-75">id: {theme.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-mono text-[10px] font-bold"
                        style={{ backgroundColor: theme.primary }}
                      >
                        +10
                      </span>
                      <span
                        className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-xs border-2"
                        style={{
                          backgroundColor: theme.hazard,
                          borderColor: theme.text,
                        }}
                      >
                        !
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {swatches.map((sw) => (
                      <button
                        key={sw.label}
                        type="button"
                        onClick={(e) => handleCopyHex(e, sw.hex)}
                        title={`Copy ${sw.label}: ${sw.hex}`}
                        className="group/swatch flex flex-col items-center p-1.5 rounded-lg bg-[#F4F6F8] hover:bg-slate-200/70 transition-colors cursor-pointer"
                      >
                        <span
                          className="w-6 h-6 rounded-full border border-black/15 mb-1"
                          style={{ backgroundColor: sw.hex }}
                        />
                        <span className="text-[10px] font-medium text-slate-600">
                          {sw.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-0.5">
                          {copiedHex === sw.hex ? (
                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                          ) : (
                            sw.hex
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 leading-relaxed">
                  {theme.contrastNote}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
