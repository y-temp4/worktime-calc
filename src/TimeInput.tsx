import React, { useRef } from "react";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const TimeInput: React.FC<TimeInputProps> = ({ value, onChange, label }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

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

  return (
    <div className="flex flex-col items-center">
      <label htmlFor={`${label}Input`} className="mb-2">
        {label}
      </label>
      <input
        id={`${label}Input`}
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleTimeChange}
        onKeyDown={handleKeyDown}
        className="border border-gray-300 rounded px-2 py-1 text-center w-20"
        placeholder="HH:MM"
        maxLength={5}
      />
    </div>
  );
};

export default TimeInput;
