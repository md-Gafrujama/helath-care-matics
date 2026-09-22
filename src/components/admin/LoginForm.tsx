"use client";

import { useActionState, useEffect, useState } from "react";
import { signIn } from "@/lib/actions/auth";

export default function LoginForm({
  next,
  initialError,
}: {
  next: string;
  initialError?: string | null;
}) {
  const [state, formAction, pending] = useActionState(signIn, {
    error: initialError ?? null,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("is-auth-pending", pending);
    return () => document.body.classList.remove("is-auth-pending");
  }, [pending]);

  return (
    <form action={formAction} className="admin-login-form" aria-busy={pending}>
      <input type="hidden" name="next" value={next} />
      {state.error && (
        <div className="admin-error" role="alert">
          {state.error}
        </div>
      )}
      <div className="field">
        <label htmlFor="email">Work email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@healthmatics.com"
          required
          autoFocus
          disabled={pending}
        />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <div className="admin-password-wrap">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            disabled={pending}
          />
          <button
            type="button"
            className="admin-password-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            disabled={pending}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-solid admin-login-submit"
        disabled={pending}
      >
        {pending ? (
          <>
            <span className="hm-spinner hm-spinner-on-dark" aria-hidden />
            Signing in…
          </>
        ) : (
          "Sign in to admin"
        )}
      </button>
      {pending && (
        <p className="admin-login-pending-hint">
          Checking credentials and opening your workspace…
        </p>
      )}
    </form>
  );
}
