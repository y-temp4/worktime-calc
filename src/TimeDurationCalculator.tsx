import React, { useState, useEffect } from "react";
import TimeInput from "./TimeInput"; // TimeInputのパスを適宜変更してください

interface TimePair {
  start: string;
  end: string;
}

const TimeDurationCalculator: React.FC = () => {
  const [timePairs, setTimePairs] = useState<TimePair[]>(() => {
    const savedTimePairs = localStorage.getItem("timePairs");
    return savedTimePairs
      ? JSON.parse(savedTimePairs)
      : [{ start: "00:00", end: "00:00" }];
  });

  const [totalDuration, setTotalDuration] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem("timePairs", JSON.stringify(timePairs));
  }, [timePairs]);

  const handleAddTimePair = () => {
    setTimePairs([...timePairs, { start: "00:00", end: "00:00" }]);
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
    setTimePairs([{ start: "00:00", end: "00:00" }]);
  };

  useEffect(() => {
    const calculateTotalDuration = () => {
      let totalMinutes = 0;

      timePairs.forEach(({ start, end }) => {
        const [startHours, startMinutes] = start.split(":").map(Number);
        const [endHours, endMinutes] = end.split(":").map(Number);

        let durationMinutes =
          endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
        if (durationMinutes < 0) {
          durationMinutes += 24 * 60; // 日をまたぐ場合
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
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Time Duration Calculator</h2>
      {timePairs.map((pair, index) => (
        <div key={index} className="flex space-x-4 mb-4 items-center">
          <TimeInput
            value={pair.start}
            onChange={(value) => handleTimeChange(index, "start", value)}
            label={`Start Time ${index + 1}`}
          />
          <button
            onClick={() => setCurrentTime(index, "start")}
            className="p-2 bg-green-500 text-white rounded"
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
            className="p-2 bg-green-500 text-white rounded"
          >
            Set Now
          </button>
          <button
            onClick={() => handleDeleteTimePair(index)}
            className="p-2 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      ))}
      <button
        onClick={handleAddTimePair}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Add Time Pair
      </button>
      <button
        onClick={handleReset}
        className="mb-4 p-2 bg-yellow-500 text-white rounded"
      >
        Reset All
      </button>
      <div className="mt-4">
        <p className="text-lg font-semibold">
          Total Duration:{" "}
          <span className="text-blue-600">{totalDuration.toFixed(3)}</span>{" "}
          hours
        </p>
      </div>
    </div>
  );
};

export default TimeDurationCalculator;
