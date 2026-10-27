import React, { useState, useEffect } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Smartphone, Tablet, Image as ImageIcon } from 'lucide-react';
import { GALLERY_MEDIA, GalleryMediaItem } from '../data/tapArcadeData';
import { ResilientImage } from './ResilientImage';

export const MediaGallerySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'raw' | 'promo-phone' | 'tablet'>('raw');
  const [lightboxItem, setLightboxItem] = useState<GalleryMediaItem | null>(null);

  const filteredItems = GALLERY_MEDIA.filter((item) => item.category === activeTab);

  // Keyboard support for Lightbox
  useEffect(() => {
    if (!lightboxItem) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxItem(null);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = filteredItems.findIndex((i) => i.id === lightboxItem.id);
        if (currentIndex >= 0) {
          setLightboxItem(filteredItems[(currentIndex + 1) % filteredItems.length]);
        }
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = filteredItems.findIndex((i) => i.id === lightboxItem.id);
        if (currentIndex >= 0) {
          setLightboxItem(
            filteredItems[(currentIndex - 1 + filteredItems.length) % filteredItems.length]
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxItem, filteredItems]);

  return (
    <section id="screenshots" className="py-20 bg-[#F4F6F8] border-y border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header + 3-Mode Segmented Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-mono text-slate-500 mb-2">
              01. Multi-Format Media Showcase · Phone, Tablet & Raw Captures
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#22252A] text-balance">
              Inspect Every Screen Across Phone &amp; Tablet
            </h2>
            <p className="text-base text-slate-600 mt-2 max-w-2xl">
              Switch between unedited hardware captures from the Android release build, Play Store
              promotional posters, and proportional tablet editions. Click any frame to inspect in full resolution.
            </p>
          </div>

          {/* 3-Tab Segmented Control */}
          <div
            className="inline-flex flex-wrap sm:flex-nowrap items-center gap-1 p-1.5 bg-white border border-slate-200 rounded-xl shrink-0"
            role="tablist"
            aria-label="Screenshot Gallery Formats"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'raw'}
              onClick={() => setActiveTab('raw')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'raw'
                  ? 'bg-[#22252A] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Actual In-App UI (Unedited)</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'promo-phone'}
              onClick={() => setActiveTab('promo-phone')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'promo-phone'
                  ? 'bg-[#22252A] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Play Store Posters (1080×1920)</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'tablet'}
              onClick={() => setActiveTab('tablet')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'tablet'
                  ? 'bg-[#22252A] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet Edition (1200×1920)</span>
            </button>
          </div>
        </div>

        {/* Tab 1 & Tab 2: 5-Column Portrait Grid / Horizontal Carousel */}
        {(activeTab === 'raw' || activeTab === 'promo-phone') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setLightboxItem(item)}
                className="group bg-white rounded-2xl border border-slate-200 p-3 flex flex-col justify-between transition-transform duration-150 hover:-translate-y-1 cursor-pointer"
              >
                <div>
                  {/* 9:16 Portrait Device Frame */}
                  <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 mb-3">
                    <ResilientImage
                      src={item.src}
                      fallbackSrc={item.fallbackSrc}
                      alt={item.title}
                      className="w-full h-full object-cover object-top transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#22252A]/90 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] font-mono text-slate-500">
                    {item.resolution}
                  </p>
                  <h3 className="text-sm font-bold text-[#22252A] mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Tablet Edition (1200×1920 7-inch, 10-inch Wide, and Official 1024×500 Feature Banners) */}
        {activeTab === 'tablet' && (
          <div className="space-y-8">
            {/* 7-Inch Portrait Tablet Row (1200×1920 · 10:16) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#22252A]">
                  7-Inch Android Tablet Captures (1200 × 1920 · 10:16 Aspect)
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  Proportional Tablet Bezel
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                {filteredItems
                  .filter((i) => i.aspect === 'portrait-tablet')
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setLightboxItem(item)}
                      className="group bg-white rounded-2xl border border-slate-200 p-3 flex flex-col justify-between transition-transform duration-150 hover:-translate-y-1 cursor-pointer"
                    >
                      <div>
                        <div className="relative aspect-[10/16] w-full rounded-xl overflow-hidden bg-[#1E2229] p-1.5 mb-3">
                          <ResilientImage
                            src={item.src}
                            fallbackSrc={item.fallbackSrc}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <p className="text-[11px] font-mono text-slate-500">
                          {item.resolution}
                        </p>
                        <h4 className="text-sm font-bold text-[#22252A] mt-0.5">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* 10-Inch Wide Tablet & Official 1024×500 Feature Graphic Banners */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#22252A]">
                  10-Inch Tablet Presentations &amp; Official Google Play Feature Graphics (1024 × 500)
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  Play Store Listing Assets
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredItems
                  .filter((i) => i.aspect === 'landscape-tablet' || i.aspect === 'banner')
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setLightboxItem(item)}
                      className="group bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between transition-transform duration-150 hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="relative rounded-xl overflow-hidden bg-slate-900 mb-3 aspect-[16/9]">
                        <ResilientImage
                          src={item.src}
                          fallbackSrc={item.fallbackSrc}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#22252A]/90 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5">
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Inspect Full Size</span>
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                          <span>{item.subtitle}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.resolution}</span>
                        </div>
                        <h4 className="text-base font-bold text-[#22252A] mt-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full-Resolution Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 md:p-8"
          onClick={() => setLightboxItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Viewport */}
            <div className="flex-1 bg-[#14171C] flex items-center justify-center p-4 relative min-h-[340px] max-h-[75vh]">
              <ResilientImage
                src={lightboxItem.src}
                fallbackSrc={lightboxItem.fallbackSrc}
                alt={lightboxItem.title}
                className="max-h-[68vh] w-auto object-contain rounded-lg"
              />

              {/* Prev / Next Controls */}
              <button
                type="button"
                onClick={() => {
                  const idx = filteredItems.findIndex((i) => i.id === lightboxItem.id);
                  if (idx >= 0) {
                    setLightboxItem(
                      filteredItems[(idx - 1 + filteredItems.length) % filteredItems.length]
                    );
                  }
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[#22252A] flex items-center justify-center hover:bg-white cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const idx = filteredItems.findIndex((i) => i.id === lightboxItem.id);
                  if (idx >= 0) {
                    setLightboxItem(filteredItems[(idx + 1) % filteredItems.length]);
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[#22252A] flex items-center justify-center hover:bg-white cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar Details */}
            <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-slate-500">
                    {lightboxItem.resolution}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLightboxItem(null)}
                    className="w-9 h-9 rounded-lg bg-[#F4F6F8] flex items-center justify-center text-slate-700 hover:bg-slate-200 cursor-pointer"
                    aria-label="Close lightbox"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs font-mono text-[#4A90E2] mb-1">
                  {lightboxItem.subtitle}
                </p>
                <h3 className="text-lg font-bold text-[#22252A]">
                  {lightboxItem.title}
                </h3>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  {lightboxItem.description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200 mt-6">
                <p className="text-xs font-mono text-slate-500">
                  Package: com.ekteder.taparcade · Use Left/Right arrow keys to cycle
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
