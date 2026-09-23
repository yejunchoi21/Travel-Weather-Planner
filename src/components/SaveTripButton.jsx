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

  useEffect(() => {
    setSavedTrip(null);
    setError("");
  }, [location, startDate, endDate]);

  if (!location || !startDate || !endDate) {
    return null;
  }

  async function handleSaveTrip() {
    setIsSaving(true);
    setError("");

    const { data, error: saveError } =
      await supabase
        .from("trips")
        .insert({
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
      setError(saveError.message);
      setIsSaving(false);
      return;
    }

    setSavedTrip(data);
    setIsSaving(false);

    if (onTripSaved) {
      onTripSaved(data);
    }
  }

  return (
    <div className="save-trip-section">
      <div>
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
    </div>
  );
}

export default SaveTripButton;