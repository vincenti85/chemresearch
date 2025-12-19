import { Beaker, X } from 'lucide-react';
import type { CurriculumMapping } from '../../types';

interface EducationalPopupProps {
  content: CurriculumMapping;
  position: { x: number; y: number };
  onClose: () => void;
}

export function EducationalPopup({ content, position, onClose }: EducationalPopupProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div
        className="fixed z-50 w-96 bg-white border-2 border-accent-600 rounded-2xl shadow-2xl"
        style={{
          left: `${Math.min(position.x, window.innerWidth - 400)}px`,
          top: `${Math.min(position.y, window.innerHeight - 300)}px`,
        }}
      >
        <div className="absolute -left-3 top-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
        <div className="absolute -left-3 top-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-accent-600" style={{ marginTop: '-2px' }}></div>
        <div className="bg-accent-100 border-b border-accent-300 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Beaker className="w-5 h-5 text-accent-600" />
            <h3 className="font-bold text-gray-900">{content.unit_code}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          <h4 className="text-accent-700 font-semibold mb-2">{content.topic_title}</h4>
          <p className="text-gray-800 text-sm leading-relaxed mb-3">{content.popup_content}</p>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">
              Chemistry Concept
            </div>
            <div className="text-sm text-accent-700 font-medium">{content.chemistry_concept}</div>
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-600">
          Click anywhere to close
        </div>
      </div>
    </>
  );
}
