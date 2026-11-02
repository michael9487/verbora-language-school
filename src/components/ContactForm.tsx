"use client";

import { useActionState, useState } from "react";
import { submitContact, type ContactState } from "@/app/contact/actions";
import { BRANCHES, MESSAGE_MAX, validateField, type ContactErrors, type ContactFields } from "@/lib/contact";

const EMPTY: ContactFields = { name: "", phone: "", email: "", branch: "", message: "" };

const inputClass =
  "w-full rounded-lg border bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-[#aaa] focus:border-brand focus:ring-3 focus:ring-brand/20 dark:bg-[#11161d] dark:text-[#e8ebef]";

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-bold text-ink dark:text-[#e8ebef]">
        {label}
        {required ? <span className="ml-1 text-[#D91E33]">*</span> : <span className="ml-1 font-normal text-ink-muted dark:text-[#9aa5b3]">（選填）</span>}
      </label>
      {children}
      <div className="flex min-h-5 justify-between gap-4 text-sm">
        <p id={`${id}-error`} className="text-[#D91E33] dark:text-[#ff8a95]" aria-live="polite">
          {error}
        </p>
        {hint}
      </div>
    </div>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });
  const [values, setValues] = useState<ContactFields>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFields, boolean>>>({});
  const [lastState, setLastState] = useState(state);
  const [showSuccess, setShowSuccess] = useState(false);

  // 伺服器回傳結果時同步表單：成功就清空，失敗就把每個欄位標成已檢查
  if (lastState !== state) {
    setLastState(state);
    if (state.status === "success") {
      setValues(EMPTY);
      setTouched({});
      setShowSuccess(true);
    } else if (state.status === "invalid" || state.status === "error") {
      setValues(state.values);
      setTouched({ name: true, phone: true, email: true, branch: true, message: true });
    }
  }

  // 即時檢查：欄位離開過（blur）之後，每打一個字就重新檢查
  const errors: ContactErrors = {};
  for (const key of Object.keys(values) as (keyof ContactFields)[]) {
    if (touched[key]) errors[key] = validateField(key, values[key]);
  }
  const hasErrors = Object.values(errors).some(Boolean);

  const bind = (name: keyof ContactFields) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": `contact-${name}-error`,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setValues((v) => ({ ...v, [name]: e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
    className: `${inputClass} ${errors[name] ? "border-[#D91E33]" : "border-[#DDE3EC] dark:border-[#2c3644]"}`,
  });

  if (showSuccess) {
    return (
      <div role="status" className="rounded-2xl bg-brand-tint p-8 text-center text-ink dark:bg-[#1d2530] dark:text-[#e8ebef]">
        <p className="text-xl font-bold">已收到您的訊息，謝謝！</p>
        <p className="mt-2 text-ink-muted dark:text-[#9aa5b3]">我們會在 3 個工作天內與您聯繫。</p>
        <button type="button" onClick={() => setShowSuccess(false)} className="mt-6 cursor-pointer rounded-full border border-brand bg-transparent px-6 py-2 font-bold text-brand dark:text-[#6fb1f5]">
          再寫一則
        </button>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      onSubmit={(e) => {
        // 送出前把全部欄位檢查一次，有錯就不送，游標移到第一個錯的欄位
        const all = { name: true, phone: true, email: true, branch: true, message: true };
        setTouched(all);
        const first = (Object.keys(values) as (keyof ContactFields)[]).find((k) => validateField(k, values[k]));
        if (first) {
          e.preventDefault();
          document.getElementById(`contact-${first}`)?.focus();
        }
      }}
      className="grid gap-x-6 gap-y-2 md:grid-cols-2"
    >
      <Field id="contact-name" label="姓名" required error={errors.name}>
        <input type="text" autoComplete="name" {...bind("name")} />
      </Field>
      <Field id="contact-phone" label="聯絡電話" required error={errors.phone}>
        <input type="tel" inputMode="tel" autoComplete="tel" placeholder="0912-345-678" {...bind("phone")} />
      </Field>
      <Field id="contact-email" label="Email" required error={errors.email}>
        <input type="email" inputMode="email" autoComplete="email" placeholder="name@example.com" {...bind("email")} />
      </Field>
      <Field id="contact-branch" label="想詢問的校區" error={errors.branch}>
        <select {...bind("branch")}>
          <option value="">不指定</option>
          {BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </Field>
      <div className="md:col-span-2">
        <Field
          id="contact-message"
          label="想詢問的內容"
          required
          error={errors.message}
          hint={
            <span className={`shrink-0 ${values.message.trim().length > MESSAGE_MAX ? "text-[#D91E33]" : "text-ink-muted dark:text-[#9aa5b3]"}`}>
              {values.message.trim().length} / {MESSAGE_MAX}
            </span>
          }
        >
          <textarea rows={6} {...bind("message")} />
        </Field>
      </div>

      {/* 防機器人：真人看不到這個欄位 */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          網站
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col items-center gap-3 md:col-span-2">
        {state.status === "error" && (
          <p role="alert" className="text-[#D91E33] dark:text-[#ff8a95]">
            {state.message}
          </p>
        )}
        <button
          type="submit"
          disabled={pending || hasErrors}
          className="min-w-48 cursor-pointer rounded-full border-0 bg-brand px-8 py-3 text-base font-bold text-white transition hover:bg-[#185CA8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "送出中…" : "送出"}
        </button>
      </div>
    </form>
  );
}
