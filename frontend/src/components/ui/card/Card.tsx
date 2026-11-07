import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function Card({ title, subtitle, children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          {title && <h3 className="font-semibold text-lg">{title}</h3>}
          {subtitle && <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{subtitle}</p>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
