interface ProgressCircleProps {
  percentage: number;
  size?: number;
}

export function ProgressCircle({ percentage, size = 120 }: ProgressCircleProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" role="progressbar" aria-valuenow={Math.round(percentage)} aria-valuemin={0} aria-valuemax={100} aria-label={`Goal completion progress: ${Math.round(percentage)}%`}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-dreampink/20"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--dreamlavender))" />
            <stop offset="100%" stopColor="hsl(var(--dreampink))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{Math.round(percentage)}%</span>
        <span className="text-sm text-foreground/60">complete</span>
      </div>
    </div>
  );
}
