import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./Auth.css";

function Auth() {
  const [isSigningUp, setIsSigningUp] =
    useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Your password must contain at least 6 characters."
      );
      return;
    }

    setIsLoading(true);

    try {
      if (isSigningUp) {
        const { error: signUpError } =
          await supabase.auth.signUp({
            email: email.trim(),
            password,
          });

        if (signUpError) {
          throw signUpError;
        }

        setMessage(
          "Account created. Check your email to confirm your account."
        );
      } else {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (signInError) {
          throw signInError;
        }

        setMessage("You are now signed in.");
      }

      setPassword("");
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsLoading(false);
    }
  }

  function changeMode() {
    setIsSigningUp(
      (currentMode) => !currentMode
    );

    setMessage("");
    setError("");
    setPassword("");
  }

  return (
    <section className="auth-section">
      <div className="auth-card">
        <p className="auth-label">
          Welcome to TripCast
        </p>

        <h1>
          {isSigningUp
            ? "Create your account"
            : "Welcome back"}
        </h1>

        <p className="auth-description">
          {isSigningUp
            ? "Create an account to save your trips and plans."
            : "Sign in to view and manage your saved trips."}
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <label>
            <span>Email address</span>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
            />
          </label>

          <label>
            <span>Password</span>

            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete={
                isSigningUp
                  ? "new-password"
                  : "current-password"
              }
            />
          </label>

          {error && (
            <p className="auth-message auth-error">
              {error}
            </p>
          )}

          {message && (
            <p className="auth-message auth-success">
              {message}
            </p>
          )}

          <button
            className="auth-submit-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? "Please wait..."
              : isSigningUp
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <div className="auth-switch">
          <span>
            {isSigningUp
              ? "Already have an account?"
              : "Don't have an account?"}
          </span>

          <button
            type="button"
            onClick={changeMode}
          >
            {isSigningUp
              ? "Sign in"
              : "Create account"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default Auth;