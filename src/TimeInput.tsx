import React, { useRef, useState } from "react";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  copyText: string;
  copiedText: string;
  copyFailedText: string;
}

const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  label,
  copyText,
  copiedText,
  copyFailedText,
}) => {
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
      setCopyStatus(copiedText);
      setTimeout(() => setCopyStatus(""), 2000);
    } catch (err) {
      setCopyStatus(copyFailedText);
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor={`${label}Input`}
        className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={`${label}Input`}
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleTimeChange}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 text-sm font-mono text-center
            bg-gray-50 dark:bg-gray-700
            border border-gray-200 dark:border-gray-600
            rounded-md
            text-gray-800 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:border-blue-500 dark:focus:border-blue-400 
            focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-800
            focus:outline-none
            transition-all duration-200
            hover:border-gray-300 dark:hover:border-gray-500"
          placeholder="HH:MM"
          maxLength={5}
        />
        <button
          onClick={handleCopy}
          className="absolute right-1 top-1 text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700
            text-blue-600 dark:text-blue-300 rounded transition-colors duration-200 cursor-pointer"
        >
          {copyText}
        </button>
      </div>
      <div className="h-4 flex items-center justify-center mt-1">
        {copyStatus && (
          <div className="text-xs text-green-600 dark:text-green-400">
            {copyStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeInput;
