import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./MyTrips.css";

function MyTrips({ onOpenTrip }) {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTrips() {
      setIsLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("You must be signed in.");
        setIsLoading(false);
        return;
      }

      const { data, error: tripsError } =
        await supabase
          .from("trips")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          });

      if (tripsError) {
        setError(tripsError.message);
      } else {
        setTrips(data || []);
      }

      setIsLoading(false);
    }

    loadTrips();
  }, []);

  async function handleDeleteTrip(tripId) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this trip?"
    );

    if (!shouldDelete) {
      return;
    }

    setError("");

    const { error: deleteError } =
      await supabase
        .from("trips")
        .delete()
        .eq("id", tripId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setTrips((currentTrips) =>
      currentTrips.filter(
        (trip) => trip.id !== tripId
      )
    );
  }

  return (
    <main className="my-trips-page">
      <section className="my-trips-container">
        <header className="my-trips-heading">
          <p>Saved adventures</p>
          <h1>My Trips</h1>
          <span>
            Reopen or manage your saved travel
            plans.
          </span>
        </header>

        {error && (
          <p className="my-trips-error">
            {error}
          </p>
        )}

        {isLoading && (
          <p className="my-trips-status">
            Loading your trips...
          </p>
        )}

        {!isLoading &&
          !error &&
          trips.length === 0 && (
            <div className="my-trips-empty">
              <h2>No saved trips yet</h2>
              <p>
                Plan a trip and save it to see it
                here.
              </p>
            </div>
          )}

        <div className="my-trips-grid">
          {trips.map((trip) => (
            <article
              className="saved-trip-card"
              key={trip.id}
            >
              <div>
                <p className="saved-trip-country">
                  {trip.country}
                </p>

                <h2>{trip.city}</h2>

                <p className="saved-trip-dates">
                  {trip.start_date} —{" "}
                  {trip.end_date}
                </p>
              </div>

              <div className="saved-trip-actions">
                <button
                  className="open-trip-button"
                  type="button"
                  onClick={() =>
                    onOpenTrip(trip)
                  }
                >
                  Open trip
                </button>

                <button
                  className="delete-trip-button"
                  type="button"
                  onClick={() =>
                    handleDeleteTrip(trip.id)
                  }
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default MyTrips;