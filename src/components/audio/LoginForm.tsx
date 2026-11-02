"use client";

import { useActionState, useEffect, useRef } from "react";
import { login, type LoginState } from "@/app/login/actions";

const REMEMBER_KEY = "verbora_audio_account";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});
  const inputRef = useRef<HTMLInputElement>(null);

  // 自動記憶帳號：登入時把帳號存在這台裝置，下次打開登入頁自動帶入
  useEffect(() => {
    const input = inputRef.current;
    if (!input || input.value) return;
    try {
      input.value = localStorage.getItem(REMEMBER_KEY) ?? "";
    } catch {}
  }, []);

  return (
    <form
      className="login-form"
      action={formAction}
      onSubmit={() => {
        try {
          localStorage.setItem(REMEMBER_KEY, (inputRef.current?.value ?? "").trim().toUpperCase());
        } catch {}
      }}
    >
      <div className="login-form-group">
        <label className="login-label" htmlFor="username">
          帳號
        </label>
        <input
          ref={inputRef}
          className={`login-input${state.error ? " is-error" : ""}`}
          type="text"
          id="username"
          name="username"
          defaultValue={state.username}
          key={state.username}
          autoComplete="username"
          autoCapitalize="characters"
          spellCheck={false}
          required
          aria-invalid={Boolean(state.error)}
          aria-describedby={state.error ? "username-error" : undefined}
        />
        {state.error && (
          <p className="login-error" id="username-error" role="alert">
            {state.error}
          </p>
        )}
      </div>
      <button type="submit" className="login-btn" disabled={pending}>
        {pending ? "登入中…" : "登入"}
      </button>
    </form>
  );
}
