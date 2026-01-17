import { useCallback, useRef, useState } from "react";

interface UseUndoRedoReturn<T> {
  state: T;
  setState: (newState: T) => void;
  setStateWithoutHistory: (newState: T) => void;
  beginChange: () => void;
  commitChange: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: (newState: T) => void;
}

export function useUndoRedo<T>(initialState: T): UseUndoRedoReturn<T> {
  const [present, setPresent] = useState<T>(initialState);
  const pastRef = useRef<T[]>([]);
  const futureRef = useRef<T[]>([]);
  const pendingSnapshotRef = useRef<T | null>(null);
  const [updateCount, setUpdateCount] = useState(0);

  // 即座に履歴に追加して状態を更新（ボタン操作など）
  const setState = useCallback((newState: T) => {
    setPresent((currentPresent) => {
      // 保留中のスナップショットがあればそれを使う、なければ現在の状態を使う
      const stateToSave = pendingSnapshotRef.current ?? currentPresent;
      pastRef.current = [...pastRef.current, stateToSave].slice(-50);
      futureRef.current = [];
      pendingSnapshotRef.current = null;
      return newState;
    });
    setUpdateCount((c) => c + 1);
  }, []);

  // 履歴に追加せず状態のみ更新（入力中に使用）
  const setStateWithoutHistory = useCallback((newState: T) => {
    setPresent(newState);
  }, []);

  // 変更開始時に現在の状態をスナップショットとして保存
  const beginChange = useCallback(() => {
    setPresent((currentPresent) => {
      if (pendingSnapshotRef.current === null) {
        pendingSnapshotRef.current = currentPresent;
      }
      return currentPresent;
    });
  }, []);

  // 変更完了時にスナップショットを履歴に追加
  const commitChange = useCallback(() => {
    setPresent((currentPresent) => {
      if (pendingSnapshotRef.current !== null) {
        // スナップショットと現在の状態が異なる場合のみ履歴に追加
        if (JSON.stringify(pendingSnapshotRef.current) !== JSON.stringify(currentPresent)) {
          pastRef.current = [...pastRef.current, pendingSnapshotRef.current].slice(-50);
          futureRef.current = [];
          setUpdateCount((c) => c + 1);
        }
        pendingSnapshotRef.current = null;
      }
      return currentPresent;
    });
  }, []);

  const undo = useCallback(() => {
    // 保留中の変更があればまずコミット
    const pendingSnapshot = pendingSnapshotRef.current;
    if (pendingSnapshot !== null) {
      setPresent((currentPresent) => {
        if (JSON.stringify(pendingSnapshot) !== JSON.stringify(currentPresent)) {
          pastRef.current = [...pastRef.current, pendingSnapshot].slice(-50);
          futureRef.current = [];
        }
        pendingSnapshotRef.current = null;
        return currentPresent;
      });
    }

    setPresent((currentPresent) => {
      if (pastRef.current.length === 0) return currentPresent;

      const previous = pastRef.current[pastRef.current.length - 1];
      pastRef.current = pastRef.current.slice(0, -1);
      futureRef.current = [currentPresent, ...futureRef.current];
      setUpdateCount((c) => c + 1);
      return previous;
    });
  }, []);

  const redo = useCallback(() => {
    setPresent((currentPresent) => {
      if (futureRef.current.length === 0) return currentPresent;

      const next = futureRef.current[0];
      futureRef.current = futureRef.current.slice(1);
      pastRef.current = [...pastRef.current, currentPresent];
      setUpdateCount((c) => c + 1);
      return next;
    });
  }, []);

  const reset = useCallback((newState: T) => {
    pastRef.current = [];
    futureRef.current = [];
    pendingSnapshotRef.current = null;
    setPresent(newState);
    setUpdateCount((c) => c + 1);
  }, []);

  // updateCount is used to trigger re-renders when refs change
  void updateCount;

  return {
    state: present,
    setState,
    setStateWithoutHistory,
    beginChange,
    commitChange,
    undo,
    redo,
    canUndo: pastRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
    reset,
  };
}
