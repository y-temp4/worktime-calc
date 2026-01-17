import type { Language, Translation } from "../i18n/translations";

type TopControlsProps = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenHelp: () => void;
  onToggleLanguage: () => void;
  language: Language;
  t: Translation;
};

export const TopControls = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenHelp,
  onToggleLanguage,
  language,
  t,
}: TopControlsProps) => {
  return (
    <div className="text-center mb-10">
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`px-3 py-1 rounded-md text-sm transition-colors duration-200 ${
            canUndo
              ? "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-pointer"
              : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
          }`}
          aria-label={t.shortcuts.undo}
          title={t.shortcuts.undo}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`px-3 py-1 rounded-md text-sm transition-colors duration-200 ${
            canRedo
              ? "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-pointer"
              : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
          }`}
          aria-label={t.shortcuts.redo}
          title={t.shortcuts.redo}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
            />
          </svg>
        </button>
        <button
          onClick={onOpenHelp}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm transition-colors duration-200 cursor-pointer"
          aria-label={t.shortcuts.showHelp}
        >
          ?
        </button>
        <button
          onClick={onToggleLanguage}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm transition-colors duration-200 cursor-pointer"
        >
          {language === "ja" ? "🇺🇸 EN" : "🇯🇵 日本語"}
        </button>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
        {t.title}
      </h1>
      <p className="text-gray-600 dark:text-gray-300">{t.subtitle}</p>
    </div>
  );
};
