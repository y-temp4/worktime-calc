import { useState, useEffect, useRef, createRef, type RefObject } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { useClipboard } from "../hooks/useClipboard";
import {
  useKeyboardShortcuts,
  ShortcutDefinition,
} from "../hooks/useKeyboardShortcuts";
import { ShortcutToast } from "./ShortcutToast";
import { ShortcutHelpModal } from "./ShortcutHelpModal";
import { CopySelectionModal, TimeOption } from "./CopySelectionModal";
import { TopControls } from "./TopControls";
import { TimePairRow } from "./TimePairRow";
import { TotalDurationCard } from "./TotalDurationCard";
import { AppFooter } from "./AppFooter";
import type { CopiedField, TimePair } from "../types/time";
import { calculateTotalDuration, getCurrentTimeInfo } from "../utils/timeUtils";

const isMac = () =>
  typeof navigator !== "undefined" && navigator.platform.includes("Mac");

export const TimeDurationCalculator = () => {
  const getInitialTimePairs = (): TimePair[] => {
    const saved = localStorage.getItem("timePairs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        localStorage.removeItem("timePairs");
      }
    }
    return [{ start: "", end: "" }];
  };

  const {
    state: timePairs,
    setState: setTimePairs,
    setStateWithoutHistory,
    beginChange,
    commitChange,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo<TimePair[]>(getInitialTimePairs());

  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [totalCopyStatus, setTotalCopyStatus] = useState<string>("");
  const [lastRecordedDate, setLastRecordedDate] = useState<string | null>(() =>
    localStorage.getItem("lastRecordedDate"),
  );
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [copyOptions, setCopyOptions] = useState<TimeOption[]>([]);
  const [copiedField, setCopiedField] = useState<CopiedField>(null);
  const { language, t, toggleLanguage } = useLanguage();
  const { copy } = useClipboard();

  // 最新のtimePairsを参照するためのref
  const timePairsRef = useRef(timePairs);
  useEffect(() => {
    timePairsRef.current = timePairs;
  }, [timePairs]);

  // 各TimeInputのrefを管理
  const inputRefsRef = useRef<
    {
      start: RefObject<HTMLInputElement | null>;
      end: RefObject<HTMLInputElement | null>;
    }[]
  >([]);

  // timePairsの数に合わせてrefsを更新
  useEffect(() => {
    inputRefsRef.current = timePairs.map(
      (_, i) =>
        inputRefsRef.current[i] || {
          start: createRef<HTMLInputElement>(),
          end: createRef<HTMLInputElement>(),
        },
    );
  }, [timePairs.length]);

  // localStorage保存
  useEffect(() => {
    localStorage.setItem("timePairs", JSON.stringify(timePairs));
  }, [timePairs]);

  // 合計時間計算
  useEffect(() => {
    setTotalDuration(calculateTotalDuration(timePairs));
  }, [timePairs]);

  // 最終記録日付を更新するヘルパー
  const updateLastRecordedDate = (date: string | null) => {
    setLastRecordedDate(date);
    if (date) {
      localStorage.setItem("lastRecordedDate", date);
    } else {
      localStorage.removeItem("lastRecordedDate");
    }
  };

  // 時刻入力変更（履歴なし、変更開始時にスナップショット保存）
  const handleTimeChange = (
    index: number,
    type: "start" | "end",
    value: string,
  ) => {
    beginChange();
    const newPairs = timePairs.map((pair, i) =>
      i === index ? { ...pair, [type]: value } : pair,
    );
    setStateWithoutHistory(newPairs);
  };

  // 入力完了時に変更をコミット
  const handleInputBlur = () => {
    commitChange();
  };

  // デバウンスされた変更コミット（上下キー用）
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleArrowKeyChange = () => {
    // 最初の変更時にスナップショットを保存
    beginChange();

    // 既存のタイマーをクリア
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    // 500ms後に変更をコミット
    debounceTimerRef.current = setTimeout(() => {
      commitChange();
      debounceTimerRef.current = null;
    }, 500);
  };

  // アンマウント時のタイマークリーンアップ
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // 現在時刻ボタン（履歴あり）
  const handleSetCurrentTime = (index: number, type: "start" | "end") => {
    const { time, date } = getCurrentTimeInfo();
    const newPairs = timePairs.map((pair, i) =>
      i === index ? { ...pair, [type]: time } : pair,
    );
    setTimePairs(newPairs);
    updateLastRecordedDate(date);
  };

  // 時間ペア追加（履歴あり）
  const handleAddTimePair = () => {
    setTimePairs([...timePairs, { start: "", end: "" }]);
  };

  // 時間ペア削除（履歴あり）
  const handleDeleteTimePair = (index: number) => {
    setTimePairs(timePairs.filter((_, i) => i !== index));
  };

  // dキー: 最新の時刻を削除（単一の値）
  // 削除後にペアが両方空になった場合はペアごと削除（最低1つは残す）
  const handleDeleteLatestTime = (): boolean => {
    const pairs = timePairsRef.current;

    // 後ろから探して、最初に値がある時刻を削除
    for (let i = pairs.length - 1; i >= 0; i--) {
      if (pairs[i].end) {
        // endを削除した後、startも空ならペアごと削除
        if (!pairs[i].start && pairs.length > 1) {
          setTimePairs(pairs.filter((_, idx) => idx !== i));
        } else {
          const newPairs = pairs.map((pair, idx) =>
            idx === i ? { ...pair, end: "" } : pair,
          );
          setTimePairs(newPairs);
        }
        return true;
      }
      if (pairs[i].start) {
        // startを削除した後、endも空ならペアごと削除
        if (!pairs[i].end && pairs.length > 1) {
          setTimePairs(pairs.filter((_, idx) => idx !== i));
        } else {
          const newPairs = pairs.map((pair, idx) =>
            idx === i ? { ...pair, start: "" } : pair,
          );
          setTimePairs(newPairs);
        }
        return true;
      }
    }
    return false;
  };

  // リセット（履歴に追加してundo可能）
  const handleReset = (): boolean => {
    const pairs = timePairsRef.current;
    const hasAnyValue = pairs.some((pair) => pair.start || pair.end);
    if (!hasAnyValue && lastRecordedDate === null) {
      return false;
    }
    setTimePairs([{ start: "", end: "" }]);
    updateLastRecordedDate(null);
    return true;
  };

  // cキー: 最初の空フィールドに現在時刻を入力
  const handleSetCurrentTimeToFirstEmpty = (): boolean => {
    const pairs = timePairsRef.current;
    const { time, date } = getCurrentTimeInfo();

    for (let i = 0; i < pairs.length; i++) {
      if (!pairs[i].start) {
        const newPairs = pairs.map((pair, idx) =>
          idx === i ? { ...pair, start: time } : pair,
        );
        setTimePairs(newPairs);
        updateLastRecordedDate(date);
        return true;
      }
      if (!pairs[i].end) {
        const newPairs = pairs.map((pair, idx) =>
          idx === i ? { ...pair, end: time } : pair,
        );
        setTimePairs(newPairs);
        updateLastRecordedDate(date);
        return true;
      }
    }
    // すべて埋まっている場合は新しいペアを追加
    setTimePairs([...pairs, { start: time, end: "" }]);
    updateLastRecordedDate(date);
    return true;
  };

  // 最新の入力があるフィールドにフォーカス（空なら現在時刻を入力）
  const focusLatestInput = (): boolean => {
    const pairs = timePairsRef.current;
    const { time, date } = getCurrentTimeInfo();

    // 後ろから探して、最初に値があるフィールドを見つける
    for (let i = pairs.length - 1; i >= 0; i--) {
      if (pairs[i].end) {
        inputRefsRef.current[i]?.end?.current?.focus();
        return true;
      }
      if (pairs[i].start) {
        inputRefsRef.current[i]?.start?.current?.focus();
        return true;
      }
    }

    // 何も入力がなければ最初のstartに現在時刻を入力してフォーカス
    const newPairs = pairs.map((pair, idx) =>
      idx === 0 ? { ...pair, start: time } : pair,
    );
    setTimePairs(newPairs);
    updateLastRecordedDate(date);

    // 次のレンダリング後にフォーカス
    setTimeout(() => {
      inputRefsRef.current[0]?.start?.current?.focus();
    }, 0);
    return true;
  };

  // コピー
  const handleTotalCopy = async () => {
    const success = await copy(totalDuration.toFixed(3));
    setTotalCopyStatus(success ? t.copied : t.copyFailed);
    setTimeout(() => setTotalCopyStatus(""), 2000);
  };

  // 入力済み時刻を収集（pairIndexとtypeも含む）
  interface TimeOptionWithField extends TimeOption {
    pairIndex: number;
    type: "start" | "end";
  }

  const getFilledTimeOptions = (): TimeOptionWithField[] => {
    const pairs = timePairsRef.current;
    const options: TimeOptionWithField[] = [];
    let idx = 1;
    pairs.forEach((pair, pairIndex) => {
      if (pair.start && idx <= 9) {
        options.push({
          label: `${t.startTime} ${pairIndex + 1}`,
          value: pair.start,
          index: idx++,
          pairIndex,
          type: "start",
        });
      }
      if (pair.end && idx <= 9) {
        options.push({
          label: `${t.endTime} ${pairIndex + 1}`,
          value: pair.end,
          index: idx++,
          pairIndex,
          type: "end",
        });
      }
    });
    return options;
  };

  // クリップボードにコピー
  const copyToClipboard = async (
    value: string,
    pairIndex: number,
    type: "start" | "end",
  ) => {
    await copy(value);
    setCopiedField({ pairIndex, type });
    setTimeout(() => setCopiedField(null), 2000);
  };

  // cキー: 時刻をコピー
  const handleCopyShortcut = (): boolean => {
    const options = getFilledTimeOptions();
    if (options.length === 0) return false;
    if (options.length === 1) {
      const opt = options[0];
      copyToClipboard(opt.value, opt.pairIndex, opt.type);
      return true;
    } else {
      setCopyOptions(options);
      setIsCopyModalOpen(true);
      return true;
    }
  };

  // コピーモーダルで選択（indexで検索して重複値に対応）
  const handleCopySelect = (index: number) => {
    const option = copyOptions.find((opt) => opt.index === index) as
      | TimeOptionWithField
      | undefined;
    if (option) {
      copyToClipboard(option.value, option.pairIndex, option.type);
    }
    setIsCopyModalOpen(false);
  };

  // ショートカット定義
  const modKey = isMac() ? "Cmd" : "Ctrl";
  const shortcuts: ShortcutDefinition[] = [
    {
      key: "n",
      action: handleSetCurrentTimeToFirstEmpty,
      allowInInput: false,
      label: t.shortcuts.setCurrentTime,
    },
    {
      key: "c",
      action: handleCopyShortcut,
      allowInInput: false,
      label: t.shortcuts.copyTime,
    },
    {
      key: "d",
      action: handleDeleteLatestTime,
      allowInInput: false,
      label: t.shortcuts.deleteLatest,
    },
    {
      key: "?",
      shift: true,
      action: () => {
        setIsHelpModalOpen(true);
        return true;
      },
      allowInInput: true,
      label: t.shortcuts.showHelp,
    },
    {
      key: "z",
      meta: isMac(),
      ctrl: !isMac(),
      action: () => {
        if (!canUndo) return false;
        undo();
        return true;
      },
      allowInInput: true,
      noToast: !canUndo,
      label: t.shortcuts.undo,
    },
    {
      key: "z",
      meta: isMac(),
      ctrl: !isMac(),
      shift: true,
      action: () => {
        if (!canRedo) return false;
        redo();
        return true;
      },
      allowInInput: true,
      noToast: !canRedo,
      label: t.shortcuts.redo,
    },
    {
      key: "r",
      ctrl: true,
      action: handleReset,
      allowInInput: true,
      label: t.shortcuts.resetAll,
    },
    {
      key: "Escape",
      action: () => {
        // 入力にフォーカスがあればフォーカスを外す
        const activeElement = document.activeElement as HTMLElement;
        if (
          activeElement?.tagName === "INPUT" ||
          activeElement?.tagName === "TEXTAREA"
        ) {
          activeElement.blur();
        }
        setIsHelpModalOpen(false);
        return true;
      },
      allowInInput: true,
      noToast: true,
    },
    {
      key: "ArrowUp",
      action: focusLatestInput,
      allowInInput: false,
      label: t.shortcuts.focusLatest,
    },
    {
      key: "ArrowDown",
      action: focusLatestInput,
      allowInInput: false,
      label: t.shortcuts.focusLatest,
    },
  ];

  const { activeKeys } = useKeyboardShortcuts({ shortcuts });

  const shortcutList = [
    { key: "N", description: t.shortcuts.setCurrentTime },
    { key: "C", description: t.shortcuts.copyTime },
    { key: "D", description: t.shortcuts.deleteLatest },
    { key: "?", description: t.shortcuts.showHelp },
    { key: `${modKey} + Z`, description: t.shortcuts.undo },
    { key: `${modKey} + Shift + Z`, description: t.shortcuts.redo },
    { key: "Ctrl + R", description: t.shortcuts.resetAll },
    { key: "Escape", description: t.shortcuts.closeModal },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 py-8 px-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <TopControls
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onOpenHelp={() => setIsHelpModalOpen(true)}
          onToggleLanguage={toggleLanguage}
          language={language}
          t={t}
        />

        {lastRecordedDate && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.lastRecorded}: {lastRecordedDate}
            </p>
          </div>
        )}

        <div className="space-y-3">
          {timePairs.map((pair, index) => (
            <TimePairRow
              key={index}
              index={index}
              pair={pair}
              totalPairs={timePairs.length}
              inputRefs={inputRefsRef.current[index]}
              onTimeChange={handleTimeChange}
              onInputBlur={handleInputBlur}
              onArrowKeyChange={handleArrowKeyChange}
              onSetCurrentTime={handleSetCurrentTime}
              onDeleteTimePair={handleDeleteTimePair}
              copiedField={copiedField}
              t={t}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={handleAddTimePair}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>➕</span>
            <span>{t.addTimePair}</span>
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>🔄</span>
            <span>{t.resetAll}</span>
          </button>
        </div>

        <TotalDurationCard
          totalDuration={totalDuration}
          totalCopyStatus={totalCopyStatus}
          onCopy={handleTotalCopy}
          t={t}
        />

        <AppFooter />
      </div>

      <ShortcutToast activeKeys={activeKeys} />

      <ShortcutHelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        shortcuts={shortcutList}
        title={t.shortcuts.modalTitle}
        closeText={t.shortcuts.close}
      />

      <CopySelectionModal
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        options={copyOptions}
        onSelect={handleCopySelect}
        title={t.copyModal.title}
        cancelText={t.copyModal.cancel}
      />
    </div>
  );
};
