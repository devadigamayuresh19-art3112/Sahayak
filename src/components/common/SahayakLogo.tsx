import React from 'react';

interface SahayakLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const SahayakLogo: React.FC<SahayakLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  onClick,
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  }[size];

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
    >
      {/* Custom scalable vector logo: Store + Assistant Checkmark */}
      <div
        className={`${iconDimensions} rounded-xl bg-[#18583d] text-white flex items-center justify-center p-1.5 shadow-sm transition-transform duration-200 group-hover:scale-105 shrink-0`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Store front roof awning */}
          <path
            d="M5 12L7 6H25L27 12V14C27 15.1 26.1 16 25 16C23.9 16 23 15.1 23 14C23 15.1 22.1 16 21 16C19.9 16 19 15.1 19 14C19 15.1 18.1 16 17 16C15.9 16 15 15.1 15 14C15 15.1 14.1 16 13 16C11.9 16 11 15.1 11 14C11 15.1 10.1 16 9 16C7.9 16 7 15.1 7 14C7 15.1 6.1 16 5 16C3.9 16 3 15.1 3 14V12H5Z"
            fill="#61b487"
            fillOpacity="0.3"
            stroke="#61b487"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Store base / counter */}
          <path
            d="M6 16V25C6 26.1 6.9 27 8 27H24C25.1 27 26 26.1 26 25V16"
            stroke="#61b487"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Dynamic Assistant Checkmark symbol in center */}
          <path
            d="M12 21L15 24L21 18"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`${textSizes} font-bold tracking-tight text-[#173127] font-heading leading-tight`}>
          Sahayak
        </span>
        {showTagline && (
          <span className="text-[11px] font-medium text-[#607269] -mt-0.5 tracking-wide">
            Your shop. Your stock. Simplified.
          </span>
        )}
      </div>
    </div>
  );
};
