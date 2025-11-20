import GidixLoader from './GidixLoader';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'rainbow';
  className?: string;
  showText?: boolean;
}

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary',
  className = '',
  showText = true 
}: LoadingSpinnerProps) => {
  return <GidixLoader size={size} variant={variant} className={className} showText={showText} />;
};

export default LoadingSpinner;

