export type Language = "ja" | "en";

export const translations = {
  ja: {
    title: "⏰ 作業時間計算機",
    subtitle: "作業時間を簡単に計算",
    startTime: "開始",
    endTime: "終了",
    setCurrentStart: "現在時刻",
    setCurrentEnd: "現在時刻",
    addTimePair: "時間ペアを追加",
    resetAll: "リセット",
    totalDuration: "📊 合計時間",
    hours: "時間",
    copy: "📋",
    copied: "コピーしました",
    copyFailed: "コピーに失敗しました",
    delete: "削除する",
    lastRecorded: "最後に記録した日付",
    meta: {
      description:
        "シンプルで使いやすい作業時間計算機。開始時刻と終了時刻を入力するだけで、複数の時間帯の合計作業時間を自動計算します。時間管理や勤怠管理に最適なWebツールです。",
      keywords:
        "作業時間,計算機,時間計算,勤怠管理,時間管理,労働時間,タイムトラッカー",
      ogTitle: "作業時間計算機 - シンプルで使いやすい時間計算ツール",
      ogDescription:
        "開始時刻と終了時刻を入力するだけで作業時間を自動計算。複数の時間帯にも対応した便利なWebツールです。",
    },
    shortcuts: {
      modalTitle: "キーボードショートカット",
      close: "閉じる",
      setCurrentTime: "現在時刻を空欄に入力",
      showHelp: "このヘルプを表示",
      undo: "元に戻す",
      redo: "やり直し",
      resetAll: "すべてリセット",
      closeModal: "モーダルを閉じる",
      copyTime: "時刻をコピー",
      deleteLatest: "最新の時刻を削除",
      focusLatest: "最新の入力にフォーカス",
    },
    copyModal: {
      title: "コピーする時刻を選択",
      cancel: "キャンセル",
    },
  },
  en: {
    title: "⏰ Time Duration Calculator",
    subtitle: "Calculate your work time duration easily",
    startTime: "Start",
    endTime: "End",
    setCurrentStart: "Now",
    setCurrentEnd: "Now",
    addTimePair: "Add Time Pair",
    resetAll: "Reset All",
    totalDuration: "📊 Total Duration",
    hours: "hours",
    copy: "📋",
    copied: "Copied",
    copyFailed: "Copy failed",
    delete: "Delete",
    lastRecorded: "Last recorded date",
    meta: {
      description:
        "Simple and easy-to-use work time duration calculator. Just enter start and end times to automatically calculate total working hours across multiple time periods. Perfect for time management and attendance tracking.",
      keywords:
        "time calculator,work hours,duration calculator,time tracking,time management,attendance,work time",
      ogTitle: "Time Duration Calculator - Simple Work Time Calculation Tool",
      ogDescription:
        "Calculate your work time duration by simply entering start and end times. Supports multiple time periods for comprehensive time tracking.",
    },
    shortcuts: {
      modalTitle: "Keyboard Shortcuts",
      close: "Close",
      setCurrentTime: "Set current time to empty field",
      showHelp: "Show this help",
      undo: "Undo",
      redo: "Redo",
      resetAll: "Reset all",
      closeModal: "Close modal",
      copyTime: "Copy time",
      deleteLatest: "Delete latest time",
      focusLatest: "Focus latest input",
    },
    copyModal: {
      title: "Select time to copy",
      cancel: "Cancel",
    },
  },
} as const;

export type Translation = (typeof translations)[Language];
