interface GidixLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'rainbow';
  className?: string;
  showText?: boolean;
}

const GidixLoader = ({ 
  size = 'md', 
  variant = 'primary',
  className = '',
  showText = true 
}: GidixLoaderProps) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };

  const variantColors = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-cyan-600',
    rainbow: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient',
  };

  const letters = ['G', 'i', 'd', 'i', 'x'];
  const colorVariants = [
    'text-blue-600',
    'text-purple-600',
    'text-pink-600',
    'text-cyan-600',
    'text-orange-600',
  ];

  if (variant === 'rainbow') {
    return (
      <div className={`flex items-center justify-center gap-1 ${className}`}>
        {showText && (
          <div className="flex items-center gap-1">
            {letters.map((letter, index) => (
              <span
                key={index}
                className={`${sizeClasses[size]} ${colorVariants[index]} font-bold`}
                style={{ 
                  animation: `pulse 1.5s ease-in-out ${index * 0.15}s infinite` 
                }}
              >
                {letter}
              </span>
            ))}
            <span className={`${sizeClasses[size]} text-gray-600 ml-1 font-bold inline-block animate-spin`}>
              ...
            </span>
          </div>
        )}
        {!showText && (
          <div className="relative">
            <div className={`${sizeClasses[size]} text-gray-600 font-bold animate-spin inline-block`}>
              ...
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {showText && (
        <span className={`${sizeClasses[size]} ${variantColors[variant]} font-bold animate-pulse`}>
          Gidix
        </span>
      )}
      <div className="relative">
        <div className={`${sizeClasses[size]} ${variantColors[variant]} animate-spin`}>
          <svg
            className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : size === 'lg' ? 'w-8 h-8' : 'w-12 h-12'}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GidixLoader;

