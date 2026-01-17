import type { Translation } from "../i18n/translations";

type TotalDurationCardProps = {
  totalDuration: number;
  totalCopyStatus: string;
  onCopy: () => void;
  t: Translation;
};

export const TotalDurationCard = ({
  totalDuration,
  totalCopyStatus,
  onCopy,
  t,
}: TotalDurationCardProps) => {
  return (
    <div className="mt-8 text-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 inline-block">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          {t.totalDuration}
        </h2>
        <div
          onClick={onCopy}
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors duration-200"
        >
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {totalDuration.toFixed(3)} {t.hours}
          </p>
        </div>
        <div className="h-4 flex items-center justify-center mt-2">
          {totalCopyStatus && (
            <div className="text-xs text-green-600 dark:text-green-400">
              {totalCopyStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
