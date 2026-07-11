import { useState } from "react";
import { supabase } from "../lib/supabase";

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      }
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">
          LaunchMind AI
        </h1>

        <p className="text-center text-muted-foreground mb-8">
          {isLogin ? "Sign in to your workspace" : "Create your account"}
        </p>

          <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border p-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border p-3"
          />

          {!isLogin && (
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full rounded-md border border-border p-3"
      />
          )}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          <button
            type="submit"
            className="w-full rounded-md bg-primary py-3 text-primary-foreground font-medium"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 w-full text-sm text-primary"
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Sign In"}
        </button>
      </div>
    </div>
  );
}