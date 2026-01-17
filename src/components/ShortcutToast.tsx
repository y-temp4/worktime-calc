type ShortcutToastProps = {
  activeKeys: { id: number; key: string; label: string }[];
};

export const ShortcutToast = ({ activeKeys }: ShortcutToastProps) => {
  if (activeKeys.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
      {activeKeys.map((item) => (
        <div
          key={item.id}
          className="bg-gray-900/90 dark:bg-white/90
                     text-white dark:text-gray-900
                     px-4 py-2 rounded-lg shadow-lg
                     text-sm sm:text-base
                     animate-shortcut-toast"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-base sm:text-lg bg-black/20 dark:bg-black/10 px-2 py-0.5 rounded">
              {item.key}
            </span>
            <span className="font-medium">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
