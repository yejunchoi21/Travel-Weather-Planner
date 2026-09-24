import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Auth from "./components/Auth";
import Home from "./pages/Home";
import MyTrips from "./pages/MyTrips";
import "./App.css";

function App() {
  const [session, setSession] = useState(null);
  const [isCheckingSession, setIsCheckingSession] =
    useState(true);

  const [currentPage, setCurrentPage] =
    useState("planner");

  const [selectedTrip, setSelectedTrip] =
    useState(null);

  useEffect(() => {
    async function getSession() {
      const { data } =
        await supabase.auth.getSession();

      setSession(data.session);
      setIsCheckingSession(false);
    }

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setIsCheckingSession(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();

    setCurrentPage("planner");
    setSelectedTrip(null);
  }

  function handleOpenTrip(trip) {
    setSelectedTrip(trip);
    setCurrentPage("planner");
  }

  function handleNewTrip() {
    setSelectedTrip(null);
    setCurrentPage("planner");
  }

  if (isCheckingSession) {
    return (
      <div className="app-loading">
        Loading TripCast...
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="app">
      <nav className="app-navigation">
        <button
          className="app-logo"
          type="button"
          onClick={handleNewTrip}
        >
          TripCast
        </button>

        <div className="app-navigation-links">
          <button
            className={
              currentPage === "planner"
                ? "navigation-button active"
                : "navigation-button"
            }
            type="button"
            onClick={handleNewTrip}
          >
            Planner
          </button>

          <button
            className={
              currentPage === "trips"
                ? "navigation-button active"
                : "navigation-button"
            }
            type="button"
            onClick={() =>
              setCurrentPage("trips")
            }
          >
            My Trips
          </button>

          <button
            className="sign-out-button"
            type="button"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </nav>

      {currentPage === "planner" ? (
        <Home
          key={selectedTrip?.id || "new-trip"}
          initialTrip={selectedTrip}
        />
      ) : (
        <MyTrips onOpenTrip={handleOpenTrip} />
      )}
    </div>
  );
}

export default App;