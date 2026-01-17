import { useEffect, useRef } from "react";

export interface TimeOption {
  label: string;
  value: string;
  index: number;
}

interface CopySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: TimeOption[];
  onSelect: (index: number) => void;
  title: string;
  cancelText: string;
}

export const CopySelectionModal: React.FC<CopySelectionModalProps> = ({
  isOpen,
  onClose,
  options,
  onSelect,
  title,
  cancelText,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      // 1-9 の数字キーで選択
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9) {
        const option = options.find((opt) => opt.index === num);
        if (option) {
          e.preventDefault();
          onSelect(option.index);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose, onSelect, options]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 animate-fade-in" />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="copy-modal-title"
        tabIndex={-1}
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl
                   p-6 max-w-md w-full mx-4
                   animate-modal-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2
            id="copy-modal-title"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400
                       dark:hover:text-gray-200 transition-colors p-1 cursor-pointer"
            aria-label={cancelText}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Options list */}
        <div className="space-y-2">
          {options.map((option) => (
            <button
              key={option.index}
              onClick={() => onSelect(option.index)}
              aria-label={`${option.label}: ${option.value}`}
              className="w-full flex items-center justify-between py-3 px-4
                         bg-gray-50 dark:bg-gray-700/50 rounded-lg
                         hover:bg-blue-50 dark:hover:bg-blue-900/30
                         transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <kbd
                  className="w-7 h-7 flex items-center justify-center
                             bg-blue-500 text-white
                             rounded font-mono text-sm font-bold"
                >
                  {option.index}
                </kbd>
                <span className="text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
              </div>
              <span className="font-mono text-lg text-gray-900 dark:text-white">
                {option.value}
              </span>
            </button>
          ))}
        </div>

        {/* Cancel button */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 px-4
                     bg-gray-200 hover:bg-gray-300
                     dark:bg-gray-700 dark:hover:bg-gray-600
                     text-gray-700 dark:text-gray-300 font-medium rounded-lg
                     transition-colors cursor-pointer"
        >
          {cancelText}
        </button>
      </div>
    </div>
  );
};
