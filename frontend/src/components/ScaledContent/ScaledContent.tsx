import { ReactNode } from 'react';
import { useFontSize } from '../../data/FontSizeContext';

interface ScaledContentProps {
  children: ReactNode;
  className?: string;
}

function ScaledContent({ children, className = '' }: ScaledContentProps) {
  const { scale } = useFontSize();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        paddingTop: '60px', // Space for header buttons
      }}
    >
      <div
        className={className}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: `${100 / scale}%`,
          maxWidth: `${100 / scale}%`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default ScaledContent;

