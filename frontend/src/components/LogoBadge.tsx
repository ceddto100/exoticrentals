import React from 'react';

type LogoBadgeSize = 'default' | 'large';

const SIZE_STYLES: Record<LogoBadgeSize, { container: string; image: string; glow: string }> = {
  default: {
    container: 'h-12 w-12',
    image: 'h-8 w-8',
    glow: 'inset-[-10px]',
  },
  large: {
    container: 'h-20 w-20',
    image: 'h-12 w-12',
    glow: 'inset-[-14px]',
  },
};

interface LogoBadgeProps {
  size?: LogoBadgeSize;
}

export const LogoBadge: React.FC<LogoBadgeProps> = ({ size = 'default' }) => {
  const dimensions = SIZE_STYLES[size];

  return (
    <div className={`relative flex items-center justify-center ${dimensions.container}`}>
      <div
        className={`absolute ${dimensions.glow} rounded-full bg-red-500/25 blur-xl opacity-80`}
        aria-hidden
      />
      <div
        className={`relative flex items-center justify-center ${dimensions.container} rounded-full bg-gradient-to-b from-white to-white/85 shadow-[0_0_24px_rgba(248,113,113,0.72)] ring-2 ring-red-400/70 overflow-hidden border border-red-200/60`}
      >
        <img
          src="/exotic_rentals.png"
          alt="Exotic Rentals logo"
          className={`${dimensions.image} object-cover rounded-full drop-shadow-[0_0_10px_rgba(248,113,113,0.45)]`}
        />
      </div>
    </div>
  );
};
