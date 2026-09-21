import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true
}) => {
  // Dimensions according to size
  const heightMap = {
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-12',
    lg: 'h-16 sm:h-20',
    xl: 'h-24 sm:h-28'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Clínica Multi tree logo from repository */}
      <img
        src="/logo_arvore_mult.png"
        alt="Logo Clínica Multi"
        className={`${heightMap[size]} w-auto object-contain transition-transform hover:scale-102`}
        loading="eager"
      />

      {showSubtitle && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold text-slate-900 tracking-tight leading-none font-serif">
              Clínica Multi
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200">
              Integrada
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium tracking-tight mt-0.5">
            Saúde & Terapias Multidisciplinares
          </span>
        </div>
      )}
    </div>
  );
};
