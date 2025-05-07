// components/UI/LoadingSpinner.tsx
import { CSSProperties, FC } from "react";
import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ 
  fullScreen = false, 
  size = 'medium',
  className = ''
}) => {
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  const spinnerStyle: CSSProperties = {
    width: sizeMap[size],
    height: sizeMap[size]
  };

  return (
    <div 
      className={`loading-spinner-container ${fullScreen ? 'full-screen' : ''} ${className}`}
      aria-live="polite"
      aria-busy="true"
    >
      <div 
        className="loading-spinner" 
        style={spinnerStyle}
      />
      <span className="visually-hidden">Загрузка...</span>
    </div>
  );
};

export default LoadingSpinner;