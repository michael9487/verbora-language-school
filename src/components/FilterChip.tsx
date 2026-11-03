// 篩選用的膠囊按鈕（關於我們的時段、校區資訊的分校）
export function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors ${
        active ? "border-brand bg-brand text-white" : "border-(--neutral-border) bg-white text-ink hover:border-brand dark:bg-(--dk-surface-2) dark:text-(--dk-text)"
      }`}
    >
      {label}
    </button>
  );
}
