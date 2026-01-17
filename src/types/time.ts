export interface TimePair {
  start: string;
  end: string;
}

export type CopiedField = {
  pairIndex: number;
  type: "start" | "end";
} | null;
