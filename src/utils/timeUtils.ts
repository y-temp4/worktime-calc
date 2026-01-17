import { TimePair } from "../types/time";

export const isValidTime = (time: string): boolean => {
  if (!time || !time.includes(":")) return false;
  const [h, m] = time.split(":").map(Number);
  return !isNaN(h) && !isNaN(m) && h >= 0 && h < 24 && m >= 0 && m < 60;
};

export const calculateTotalDuration = (pairs: TimePair[]): number => {
  let totalMinutes = 0;
  pairs.forEach(({ start, end }) => {
    if (!isValidTime(start) || !isValidTime(end)) return;
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    let duration = eh * 60 + em - (sh * 60 + sm);
    if (duration < 0) duration += 24 * 60;
    totalMinutes += duration;
  });
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return parseFloat((hours + minutes / 60).toFixed(3));
};

export const getCurrentTimeInfo = () => {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  const date = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
  return { time, date };
};
