import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  return (
    <div
      className={`
        backdrop-blur-xl bg-white/10
        border border-white/20
        rounded-2xl shadow-2xl
        ${hover ? 'hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:scale-[1.02]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
