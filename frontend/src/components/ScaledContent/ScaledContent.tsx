import { ReactNode } from 'react';
import { useFontSize } from '../../data/FontSizeContext';

interface ScaledContentProps {
  children: ReactNode;
  className?: string;
}

function ScaledContent({ children, className = '' }: ScaledContentProps) {
  const { scale } = useFontSize();

  return (
    <>
      {/* Fixed background that covers entire viewport */}
      <div 
        className="fixed inset-0 bg-gradient-to-r from-blue-50 to-orange-100 -z-10"
        style={{ minHeight: '100vh' }}
      />
      
      {/* Scrollable content area */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          minHeight: '100vh',
          paddingTop: '60px', // Space for header buttons
          paddingBottom: '40px',
          width: '100%',
        }}
      >
        <div
          className={className}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            width: `${100 / scale}%`,
            maxWidth: `${100 / scale}%`,
            marginBottom: `${(scale - 1) * 100}vh`, // Extra space for scaled content
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export default ScaledContent;

