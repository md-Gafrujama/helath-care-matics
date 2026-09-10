"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setPending(false);
      return;
    }

    router.push(next.startsWith("/admin") ? next : "/admin");
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="admin-login-form">
      {error && (
        <div className="admin-error" role="alert">
          {error}
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
          />
          <button
            type="button"
            className="admin-password-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-primary admin-login-submit"
        disabled={pending}
      >
        {pending ? "Signing in…" : "Sign in to admin"}
      </button>
    </form>
  );
}
