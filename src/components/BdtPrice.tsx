import React from 'react';

interface BdtIconProps {
  className?: string;
  size?: number | string;
  variant?: 'glyph' | 'badge' | 'circle';
}

/**
 * Precision Bangladeshi Taka (BDT) Symbol & Icon
 * Styled specifically for authentic Bangladeshi e-commerce (Ghorer Bazar standard)
 */
export const BdtIcon: React.FC<BdtIconProps> = ({ 
  className = 'w-3.5 h-3.5 inline-block', 
  size,
  variant = 'glyph'
}) => {
  if (variant === 'circle') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={className}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="1.8" className="opacity-80" />
        <path
          d="M8.5 7h5c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5h-5m0-5v10m0-5h6.5m-1.5 5h3"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (variant === 'badge') {
    return (
      <span className={`inline-flex items-center justify-center font-black rounded text-[10px] px-1 py-0.2 bg-emerald-800 text-white ${className}`}>
        ৳ BDT
      </span>
    );
  }

  // Standard crisp Taka symbol (৳) vector glyph with perfect vertical alignment
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={{ width: size, height: size }}
      aria-label="BDT"
      role="img"
    >
      {/* Authentic Bengali Taka glyph path */}
      <path d="M8 4.5C8 3.95 8.45 3.5 9 3.5H17C17.55 3.5 18 3.95 18 4.5C18 5.05 17.55 5.5 17 5.5H9C8.45 5.5 8 5.05 8 4.5ZM14.5 5.5V9.5C14.5 10.33 13.83 11 13 11H5C4.45 11 4 11.45 4 12C4 12.55 4.45 13 5 13H13C14.93 13 16.5 11.43 16.5 9.5V5.5H14.5ZM13 13H5C4.45 13 4 13.45 4 14C4 14.55 4.45 15 5 15H13C15.21 15 17 16.79 17 19C17 19.55 17.45 20 18 20C18.55 20 19 19.55 19 19C19 15.69 16.31 13 13 13ZM6 18.5C6 17.95 6.45 17.5 7 17.5H12C12.55 17.5 13 17.95 13 18.5C13 19.05 12.55 19.5 12 19.5H7C6.45 19.5 6 19.05 6 18.5Z" />
    </svg>
  );
};

/**
 * Format a numeric amount to localized Bangladeshi Taka string (e.g., ৳1,250)
 */
export function formatBdt(amount: number): string {
  if (isNaN(amount)) return '৳0';
  const rounded = Math.round(amount);
  return `৳${rounded.toLocaleString('en-IN')}`;
}

export function formatBdtNumber(amount: number): string {
  if (isNaN(amount)) return '0';
  const rounded = Math.round(amount);
  return rounded.toLocaleString('en-IN');
}

interface BdtPriceProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  className?: string;
  showOriginal?: boolean;
  highlightDiscount?: boolean;
}

export const BdtPrice: React.FC<BdtPriceProps> = ({
  price,
  originalPrice,
  size = 'base',
  className = '',
  showOriginal = true,
  highlightDiscount = false,
}) => {
  const sizeClasses = {
    sm: 'text-xs sm:text-sm',
    base: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
    xl: 'text-lg sm:text-xl',
    '2xl': 'text-xl sm:text-2xl md:text-3xl',
  };

  const symbolSizes = {
    sm: 'text-[11px] sm:text-xs',
    base: 'text-xs sm:text-sm',
    lg: 'text-sm sm:text-base',
    xl: 'text-base sm:text-lg',
    '2xl': 'text-lg sm:text-2xl',
  };

  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <div className={`inline-flex items-baseline gap-1.5 ${className}`}>
      {/* Current Price with BDT Taka Symbol */}
      <span className={`font-black text-stone-900 inline-flex items-baseline ${sizeClasses[size]}`}>
        <span className={`font-extrabold mr-0.5 text-emerald-800 ${symbolSizes[size]}`} aria-hidden="true">
          ৳
        </span>
        <span>{formatBdtNumber(price)}</span>
      </span>

      {/* Strikethrough Original Price */}
      {showOriginal && hasDiscount && (
        <span className="text-xs text-stone-400 line-through inline-flex items-baseline font-normal">
          <span className="mr-0.5 text-[10px]">৳</span>
          <span>{formatBdtNumber(originalPrice)}</span>
        </span>
      )}

      {/* Optional % discount pill */}
      {highlightDiscount && hasDiscount && (
        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-100">
          -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
        </span>
      )}
    </div>
  );
};
