import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Auth from "./components/Auth";
import Home from "./pages/Home";
import "./App.css";

function App() {
  const [session, setSession] = useState(null);
  const [isCheckingSession, setIsCheckingSession] =
    useState(true);

  useEffect(() => {
    async function getCurrentSession() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      setSession(currentSession);
      setIsCheckingSession(false);
    }

    getCurrentSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, updatedSession) => {
        setSession(updatedSession);
        setIsCheckingSession(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign-out error:", error.message);
    }
  }

  if (isCheckingSession) {
    return (
      <main className="app-loading">
        <div className="app-loading-circle" />

        <p>Loading TripCast...</p>
      </main>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <span className="app-logo">
            TripCast
          </span>

          <span className="app-user-email">
            {session.user.email}
          </span>
        </div>

        <button
          className="sign-out-button"
          type="button"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </header>

      <Home />
    </div>
  );
}

export default App;