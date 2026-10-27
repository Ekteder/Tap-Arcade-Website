import React, { useState } from 'react';
import { Smartphone } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  containerClassName = '',
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [triedFallback, setTriedFallback] = useState<boolean>(false);
  const [hasFailed, setHasFailed] = useState<boolean>(false);

  const handleError = () => {
    if (!triedFallback && fallbackSrc && fallbackSrc !== currentSrc) {
      setTriedFallback(true);
      setCurrentSrc(fallbackSrc);
    } else {
      setHasFailed(true);
    }
  };

  if (hasFailed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F4F6F8] text-[#22252A] p-6 text-center border border-slate-200 ${containerClassName} ${className}`}
      >
        <Smartphone className="w-8 h-8 text-[#4A90E2] mb-2" />
        <p className="text-xs font-semibold text-slate-700">{alt}</p>
        <p className="text-[11px] font-mono text-slate-500 mt-1">Tap Arcade · com.ekteder.taparcade</p>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={handleError}
      className={className}
    />
  );
};
