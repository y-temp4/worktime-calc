import React, { useState, useEffect } from "react";
import TimeInput from "./TimeInput";

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
    <div className="flex flex-col items-center py-10 px-4 bg-gray-100 dark:bg-gray-800 shadow dark:shadow-gray-700 transition-colors duration-200 min-h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Time Duration Calculator
      </h2>
      {timePairs.map((pair, index) => (
        <div key={index} className="flex space-x-4 mb-4 items-center">
          <TimeInput
            value={pair.start}
            onChange={(value) => handleTimeChange(index, "start", value)}
            label={`Start Time ${index + 1}`}
          />
          <button
            onClick={() => setCurrentTime(index, "start")}
            className="p-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded transition-colors duration-200"
          >
            Set Now
          </button>
          <TimeInput
            value={pair.end}
            onChange={(value) => handleTimeChange(index, "end", value)}
            label={`End Time ${index + 1}`}
          />
          <button
            onClick={() => setCurrentTime(index, "end")}
            className="p-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded transition-colors duration-200"
          >
            Set Now
          </button>
          <button
            onClick={() => handleDeleteTimePair(index)}
            className="p-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      ))}
      <button
        onClick={handleAddTimePair}
        className="mb-4 p-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded transition-colors duration-200"
      >
        Add Time Pair
      </button>
      <button
        onClick={handleReset}
        className="mb-4 p-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white rounded transition-colors duration-200"
      >
        Reset All
      </button>
      <div className="mt-4">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Total Duration:{" "}
          <span className="text-blue-600 dark:text-blue-400">
            {totalDuration.toFixed(3)}
          </span>{" "}
          hours
        </p>
      </div>
    </div>
  );
};

export default TimeDurationCalculator;
