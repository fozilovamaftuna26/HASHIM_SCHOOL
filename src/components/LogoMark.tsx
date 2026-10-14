interface LogoMarkProps {
  className?: string;
}

export function LogoMark({ className = 'w-10 h-10 text-blue-950 dark:text-blue-100' }: LogoMarkProps) {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <svg viewBox="0 0 52 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
        <rect x="2" y="2" width="48" height="56" stroke="currentColor" strokeWidth="4" />
        <path d="M16 16V44M36 16V44M16 30H36" stroke="currentColor" strokeWidth="6" />
      </svg>
    </div>
  );
}
