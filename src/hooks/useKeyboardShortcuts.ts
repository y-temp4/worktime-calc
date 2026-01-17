import { useEffect, useState, useRef } from "react";

export interface ShortcutDefinition {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  action: () => boolean;
  allowInInput?: boolean;
  noToast?: boolean;
  label?: string;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: ShortcutDefinition[];
}

const isMac = () =>
  typeof navigator !== "undefined" && navigator.platform.includes("Mac");

const formatKeyDisplay = (e: KeyboardEvent): string => {
  const parts: string[] = [];
  const shiftSymbols = ["?", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "{", "}", "|", ":", '"', "<", ">", "~"];
  const isShiftSymbol = shiftSymbols.includes(e.key);

  if (e.ctrlKey) parts.push("Ctrl");
  if (e.metaKey) parts.push(isMac() ? "Cmd" : "Win");
  if (e.altKey) parts.push(isMac() ? "Option" : "Alt");
  if (e.shiftKey && !isShiftSymbol) parts.push("Shift");

  let key = e.key;
  if (key === " ") key = "Space";
  else if (key.length === 1 && !isShiftSymbol) key = key.toUpperCase();

  parts.push(key);
  return parts.join(" + ");
};

const matchesShortcut = (e: KeyboardEvent, shortcut: ShortcutDefinition): boolean => {
  const keyMatches = e.key.toLowerCase() === shortcut.key.toLowerCase();
  const ctrlMatches = shortcut.ctrl ? e.ctrlKey : !e.ctrlKey;
  const metaMatches = shortcut.meta ? e.metaKey : !e.metaKey;
  const shiftMatches = shortcut.shift ? e.shiftKey : !e.shiftKey;

  return keyMatches && ctrlMatches && metaMatches && shiftMatches;
};

export const useKeyboardShortcuts = ({ shortcuts }: UseKeyboardShortcutsOptions) => {
  const [activeKeys, setActiveKeys] = useState<{ id: number; key: string; label: string }[]>([]);
  const nextIdRef = useRef(0);
  const shortcutsRef = useRef(shortcuts);

  // 常に最新のshortcutsを参照
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputFocused =
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA";

      for (const shortcut of shortcutsRef.current) {
        if (matchesShortcut(e, shortcut)) {
          if (!isInputFocused || shortcut.allowInInput) {
            e.preventDefault();
            const didRun = shortcut.action();
            if (didRun && !shortcut.noToast) {
              const keyLabel = formatKeyDisplay(e);
              const label = shortcut.label || keyLabel;
              const id = nextIdRef.current++;
              setActiveKeys(prev => [...prev, { id, key: keyLabel, label }]);
              setTimeout(() => {
                setActiveKeys(prev => prev.filter(item => item.id !== id));
              }, 1000);
            }
            return;
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { activeKeys };
};
