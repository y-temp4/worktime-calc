import React, { useRef, useState } from "react";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const TimeInput: React.FC<TimeInputProps> = ({ value, onChange, label }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>("");

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const [hours, minutes] = value.split(":").map(Number);
      let newMinutes = minutes + (e.key === "ArrowUp" ? 1 : -1);
      let newHours = hours;

      if (newMinutes > 59) {
        newMinutes = 0;
        newHours = (newHours + 1) % 24;
      } else if (newMinutes < 0) {
        newMinutes = 59;
        newHours = (newHours - 1 + 24) % 24;
      }

      onChange(
        `${newHours.toString().padStart(2, "0")}:${newMinutes
          .toString()
          .padStart(2, "0")}`
      );
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus("コピーしました");
      setTimeout(() => setCopyStatus(""), 2000);
    } catch (err) {
      setCopyStatus("コピーに失敗しました");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label
        htmlFor={`${label}Input`}
        className="mb-2 text-gray-700 dark:text-gray-300 font-medium transition-colors duration-200"
      >
        {label}
      </label>
      <div className="flex flex-col items-center gap-2">
        <input
          id={`${label}Input`}
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleTimeChange}
          onKeyDown={handleKeyDown}
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-center w-20
            bg-white dark:bg-gray-700
            text-gray-800 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:border-blue-500 dark:focus:border-blue-400 
            focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400
            focus:outline-none
            transition-colors duration-200"
          placeholder="HH:MM"
          maxLength={5}
        />
        <div className="relative">
          <button
            onClick={handleCopy}
            className="text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500
              text-gray-700 dark:text-gray-200 rounded px-2 py-1 transition-colors duration-200"
          >
            コピー
          </button>
          {copyStatus && (
            <div className="fixed mt-1 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 shadow-sm text-green-600 dark:text-green-400 whitespace-nowrap">
              {copyStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeInput;
