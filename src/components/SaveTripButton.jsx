import { useState } from "react";
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

  const [savedTripId, setSavedTripId] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] = useState("");

  async function handleSaveTrip() {
    setMessage("");
    setError("");

    if (!location) {
      setError(
        "Search for a destination before saving."
      );
      return;
    }

    if (!startDate || !endDate) {
      setError(
        "Select both arrival and departure dates."
      );
      return;
    }

    setIsSaving(true);

    try {
      const {
        data: userData,
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      const user = userData.user;

      if (!user) {
        throw new Error(
          "You must sign in before saving a trip."
        );
      }

      const {
        data: savedTrip,
        error: saveError,
      } = await supabase
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

      /*
        This is the important part.

        It sends the complete saved trip,
        including its database ID, back to Home.jsx.
      */
      setSavedTripId(savedTrip.id);

      if (onTripSaved) {
        onTripSaved(savedTrip);
      }

      setMessage(
        "This trip is saved to your account."
      );
    } catch (saveTripError) {
      setError(
        saveTripError.message ||
          "Unable to save this trip."
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (
    !location ||
    !startDate ||
    !endDate
  ) {
    return null;
  }

  return (
    <section className="save-trip-section">
      <div className="save-trip-content">
        <div>
          <p className="save-trip-label">
            Save your plan
          </p>

          <h2>Keep this trip</h2>

          <p className="save-trip-description">
            Save your destination, dates,
            itinerary, and packing list to
            your account.
          </p>
        </div>

        <button
          className="save-trip-button"
          type="button"
          onClick={handleSaveTrip}
          disabled={
            isSaving || Boolean(savedTripId)
          }
        >
          {isSaving
            ? "Saving..."
            : savedTripId
              ? "Trip saved"
              : "Save trip"}
        </button>
      </div>

      {message && (
        <p className="save-trip-success">
          ✓ {message}
        </p>
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