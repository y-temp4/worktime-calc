import React, { useState, useEffect } from "react";
import TimeInput from "./TimeInput";
import { useLanguage } from "./hooks/useLanguage";

interface TimePair {
  start: string;
  end: string;
}

const TimeDurationCalculator: React.FC = () => {
  const [timePairs, setTimePairs] = useState<TimePair[]>(() => {
    const savedTimePairs = localStorage.getItem("timePairs");
    return savedTimePairs
      ? JSON.parse(savedTimePairs)
      : [{ start: "", end: "" }];
  });

  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [totalCopyStatus, setTotalCopyStatus] = useState<string>("");
  const [lastRecordedDate, setLastRecordedDate] = useState<string | null>(() => {
    return localStorage.getItem("lastRecordedDate");
  });
  const { language, t, toggleLanguage } = useLanguage();

  useEffect(() => {
    localStorage.setItem("timePairs", JSON.stringify(timePairs));
  }, [timePairs]);

  const handleAddTimePair = () => {
    setTimePairs([...timePairs, { start: "", end: "" }]);
  };

  const handleTimeChange = (
    index: number,
    type: "start" | "end",
    value: string
  ) => {
    const newTimePairs = [...timePairs];
    newTimePairs[index][type] = value;
    setTimePairs(newTimePairs);
  };

  const setCurrentTime = (index: number, type: "start" | "end") => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const newTime = `${hours}:${minutes}`;

    // Format date as YYYY-MM-DD
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    setLastRecordedDate(dateString);
    localStorage.setItem("lastRecordedDate", dateString);

    const newTimePairs = [...timePairs];
    newTimePairs[index][type] = newTime;
    setTimePairs(newTimePairs);
  };

  const handleDeleteTimePair = (index: number) => {
    const newTimePairs = timePairs.filter((_, i) => i !== index);
    setTimePairs(newTimePairs);
  };

  const handleReset = () => {
    setTimePairs([{ start: "", end: "" }]);
    setLastRecordedDate(null);
    localStorage.removeItem("lastRecordedDate");
  };

  const handleTotalCopy = async () => {
    try {
      await navigator.clipboard.writeText(totalDuration.toFixed(3));
      setTotalCopyStatus(t.copied);
      setTimeout(() => setTotalCopyStatus(""), 2000);
    } catch (err) {
      setTotalCopyStatus(t.copyFailed);
      setTimeout(() => setTotalCopyStatus(""), 2000);
    }
  };

  useEffect(() => {
    const calculateTotalDuration = () => {
      let totalMinutes = 0;

      timePairs.forEach(({ start, end }) => {
        const [startHours, startMinutes] = start.split(":").map(Number);
        const [endHours, endMinutes] = end.split(":").map(Number);

        if (
          startHours === undefined ||
          startMinutes === undefined ||
          endHours === undefined ||
          endMinutes === undefined
        ) {
          return;
        }

        let durationMinutes =
          endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
        if (durationMinutes < 0) {
          durationMinutes += 24 * 60;
        }
        totalMinutes += durationMinutes;
      });

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      setTotalDuration(parseFloat((hours + minutes / 60).toFixed(3)));
    };

    calculateTotalDuration();
  }, [timePairs]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 py-8 px-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleLanguage}
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

        {lastRecordedDate && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.lastRecorded}: {lastRecordedDate}
            </p>
          </div>
        )}

        <div className="space-y-3">
          {timePairs.map((pair, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 py-4 pl-4 pr-2 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 bg-blue-500 dark:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {index + 1}
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <TimeInput
                        value={pair.start}
                        onChange={(value) =>
                          handleTimeChange(index, "start", value)
                        }
                        label={t.startTime}
                        copyText={t.copy}
                        copiedText={t.copied}
                        copyFailedText={t.copyFailed}
                      />
                    </div>
                    <button
                      onClick={() => setCurrentTime(index, "start")}
                      className="px-2 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded text-xs font-medium transition-colors duration-200 mb-5 cursor-pointer"
                    >
                      {t.setCurrentStart}
                    </button>
                  </div>

                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <TimeInput
                        value={pair.end}
                        onChange={(value) =>
                          handleTimeChange(index, "end", value)
                        }
                        label={t.endTime}
                        copyText={t.copy}
                        copiedText={t.copied}
                        copyFailedText={t.copyFailed}
                      />
                    </div>
                    <button
                      onClick={() => setCurrentTime(index, "end")}
                      className="px-2 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded text-xs font-medium transition-colors duration-200 mb-5 cursor-pointer"
                    >
                      {t.setCurrentEnd}
                    </button>
                  </div>
                </div>

                <div className="w-8">
                  {timePairs.length > 1 && (
                    <button
                      onClick={() => handleDeleteTimePair(index)}
                      className="tooltip text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded shrink-0 cursor-pointer"
                      data-tooltip={t.delete}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
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

        <div className="mt-8 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 inline-block">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              {t.totalDuration}
            </h2>
            <div
              onClick={handleTotalCopy}
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

        <footer className="mt-16 text-center">
          <a
            href="https://github.com/y-temp4/worktime-calc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
          >
            GitHub
          </a>
        </footer>
      </div>
    </div>
  );
};

export default TimeDurationCalculator;
