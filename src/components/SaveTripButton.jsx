import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./SaveTripButton.css";

function SaveTripButton({
  location,
  startDate,
  endDate,
  onTripSaved,
}) {
  const [isSaving, setIsSaving] =
    useState(false);

  const [savedTrip, setSavedTrip] =
    useState(null);

  const [error, setError] = useState("");

  // Reset the saved message when trip details change
  useEffect(() => {
    setSavedTrip(null);
    setError("");

    if (onTripSaved) {
      onTripSaved(null);
    }
  }, [location, startDate, endDate, onTripSaved]);

  // Hide the component until the trip is complete
  if (!location || !startDate || !endDate) {
    return null;
  }

  async function handleSaveTrip() {
    setIsSaving(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "You must be signed in to save a trip."
        );
      }

      const { data, error: saveError } =
        await supabase
          .from("trips")
          .insert({
            user_id: user.id,
            city: location.name,
            country: location.country,
            latitude: location.latitude,
            longitude: location.longitude,
            start_date: startDate,
            end_date: endDate,
          })
          .select()
          .single();

      if (saveError) {
        throw saveError;
      }

      setSavedTrip(data);

      if (onTripSaved) {
        onTripSaved(data);
      }
    } catch (saveError) {
      setError(
        saveError.message ||
          "The trip could not be saved."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="save-trip-section">
      <div className="save-trip-content">
        <p className="save-trip-label">
          Save your plan
        </p>

        <h2>Keep this trip</h2>

        <p className="save-trip-description">
          Save your destination, dates, itinerary,
          and packing list to your account.
        </p>
      </div>

      {savedTrip ? (
        <div className="trip-saved-message">
          <span className="trip-saved-check">
            ✓
          </span>

          <span>Trip saved successfully</span>
        </div>
      ) : (
        <button
          className="save-trip-button"
          type="button"
          onClick={handleSaveTrip}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save trip"}
        </button>
      )}

      {error && (
        <p className="save-trip-error">
          {error}
        </p>
      )}
    </section>
  );
}

export default SaveTripButton;