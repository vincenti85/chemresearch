import { useState, useRef, ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { EducationalPopup } from './EducationalPopup';
import { useEducationalContent } from '../../hooks/useCurriculum';
import { useAppStore } from '../../store';

interface EducationalWidgetProps {
  targetMetric: string;
  children: ReactNode;
  className?: string;
}

export function EducationalWidget({ targetMetric, children, className = '' }: EducationalWidgetProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const activeUnit = useAppStore((state) => state.activeUnit);
  const highlightedMetric = useAppStore((state) => state.highlightedMetric);
  const educationalContent = useEducationalContent(targetMetric);

  const isHighlighted = highlightedMetric === targetMetric;
  const hasEducationalContent = activeUnit && educationalContent;

  const handleMouseEnter = () => {
    if (hasEducationalContent) {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (rect) {
        setPopupPosition({
          x: rect.right + 10,
          y: rect.top,
        });
        setShowPopup(true);
      }
    }
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  const handlePopupMouseEnter = () => {
    setShowPopup(true);
  };

  const handlePopupMouseLeave = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div
        ref={wrapperRef}
        className={`relative ${className} ${isHighlighted ? 'ring-2 ring-accent-500 ring-offset-2 ring-offset-dark-950' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {hasEducationalContent && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="bg-accent-600 text-white rounded-full p-1 shadow-lg">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>
        )}
        {children}
      </div>

      {showPopup && educationalContent && (
        <div
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
        >
          <EducationalPopup
            content={educationalContent}
            position={popupPosition}
            onClose={() => setShowPopup(false)}
          />
        </div>
      )}
    </>
  );
}
