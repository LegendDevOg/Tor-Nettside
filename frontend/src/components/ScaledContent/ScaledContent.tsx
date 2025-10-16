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
      className={className}
      style={{
        fontSize: `${scale}rem`,
        lineHeight: '1.5',
      }}
    >
      <style>
        {`
          /* Scale images proportionally while maintaining layout */
          [data-scaled-content] img {
            width: ${scale * 100}%;
            height: auto;
            max-width: 100%;
            object-fit: contain;
          }
          
          /* Keep logo images at a reasonable size */
          [data-scaled-content] .h-40 {
            height: ${10 * scale}rem;
          }
        `}
      </style>
      <div data-scaled-content>
        {children}
      </div>
    </div>
  );
}

export default ScaledContent;

