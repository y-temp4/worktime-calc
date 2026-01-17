import type { RefObject } from "react";
import { TimeInput } from "./TimeInput";
import type { Translation } from "../i18n/translations";
import type { CopiedField, TimePair } from "../types/time";

type TimePairRowProps = {
  index: number;
  pair: TimePair;
  totalPairs: number;
  inputRefs?: {
    start: RefObject<HTMLInputElement | null>;
    end: RefObject<HTMLInputElement | null>;
  };
  onTimeChange: (index: number, type: "start" | "end", value: string) => void;
  onInputBlur: () => void;
  onArrowKeyChange: () => void;
  onSetCurrentTime: (index: number, type: "start" | "end") => void;
  onDeleteTimePair: (index: number) => void;
  copiedField: CopiedField;
  t: Translation;
};

export const TimePairRow = ({
  index,
  pair,
  totalPairs,
  inputRefs,
  onTimeChange,
  onInputBlur,
  onArrowKeyChange,
  onSetCurrentTime,
  onDeleteTimePair,
  copiedField,
  t,
}: TimePairRowProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 py-4 pl-4 pr-2 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 bg-blue-500 dark:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
          {index + 1}
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <TimeInput
                ref={inputRefs?.start}
                value={pair.start}
                onChange={(value) => onTimeChange(index, "start", value)}
                onBlur={onInputBlur}
                onArrowKeyChange={onArrowKeyChange}
                label={t.startTime}
                copyText={t.copy}
                copiedText={t.copied}
                copyFailedText={t.copyFailed}
                externalCopyStatus={
                  copiedField?.pairIndex === index &&
                  copiedField?.type === "start"
                    ? t.copied
                    : undefined
                }
              />
            </div>
            <button
              onClick={() => onSetCurrentTime(index, "start")}
              aria-label={t.setCurrentStart}
              className="px-2 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded text-xs font-medium transition-colors duration-200 mb-5 cursor-pointer"
            >
              {t.setCurrentStart}
            </button>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <TimeInput
                ref={inputRefs?.end}
                value={pair.end}
                onChange={(value) => onTimeChange(index, "end", value)}
                onBlur={onInputBlur}
                onArrowKeyChange={onArrowKeyChange}
                label={t.endTime}
                copyText={t.copy}
                copiedText={t.copied}
                copyFailedText={t.copyFailed}
                externalCopyStatus={
                  copiedField?.pairIndex === index &&
                  copiedField?.type === "end"
                    ? t.copied
                    : undefined
                }
              />
            </div>
            <button
              onClick={() => onSetCurrentTime(index, "end")}
              aria-label={t.setCurrentEnd}
              className="px-2 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded text-xs font-medium transition-colors duration-200 mb-5 cursor-pointer"
            >
              {t.setCurrentEnd}
            </button>
          </div>
        </div>

        <div className="w-8">
          {totalPairs > 1 && (
            <button
              onClick={() => onDeleteTimePair(index)}
              aria-label={t.delete}
              className="tooltip text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded shrink-0 cursor-pointer"
              data-tooltip={t.delete}
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
