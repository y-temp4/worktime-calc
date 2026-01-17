import { useCallback } from "react";

interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>;
}

export function useClipboard(): UseClipboardReturn {
  const copy = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { copy };
}
