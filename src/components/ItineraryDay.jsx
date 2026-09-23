import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  formatTripDate,
  getTripDates,
} from "../utils/dates";
import ItineraryDay from "./ItineraryDay";
import "./Itinerary.css";

function Itinerary({
  location,
  startDate,
  endDate,
  tripId,
}) {
  const [activities, setActivities] =
    useState({});

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadActivities() {
      if (!tripId) {
        setActivities({});
        return;
      }

      setIsLoading(true);
      setError("");

      const { data, error: loadError } =
        await supabase
          .from("activities")
          .select("*")
          .eq("trip_id", tripId)
          .order("activity_date", {
            ascending: true,
          })
          .order("activity_time", {
            ascending: true,
            nullsFirst: false,
          });

      if (loadError) {
        setError(loadError.message);
        setIsLoading(false);
        return;
      }

      const groupedActivities = {};

      data.forEach((activity) => {
        const date = activity.activity_date;

        if (!groupedActivities[date]) {
          groupedActivities[date] = [];
        }

        groupedActivities[date].push({
          id: activity.id,
          name: activity.name,
          time: activity.activity_time
            ? activity.activity_time.slice(0, 5)
            : "",
        });
      });

      setActivities(groupedActivities);
      setIsLoading(false);
    }

    loadActivities();
  }, [tripId]);

  if (!location || !startDate || !endDate) {
    return null;
  }

  const tripDates = getTripDates(
    startDate,
    endDate
  );

  async function addActivity(
    date,
    newActivity
  ) {
    if (!tripId) {
      setError(
        "Save the trip before adding activities."
      );

      return false;
    }

    setError("");

    const { data, error: saveError } =
      await supabase
        .from("activities")
        .insert({
          trip_id: tripId,
          activity_date: date,
          activity_time:
            newActivity.time || null,
          name: newActivity.name,
        })
        .select()
        .single();

    if (saveError) {
      setError(saveError.message);
      return false;
    }

    const savedActivity = {
      id: data.id,
      name: data.name,
      time: data.activity_time
        ? data.activity_time.slice(0, 5)
        : "",
    };

    setActivities((currentActivities) => ({
      ...currentActivities,

      [date]: [
        ...(currentActivities[date] || []),
        savedActivity,
      ],
    }));

    return true;
  }

  async function deleteActivity(
    date,
    activityId
  ) {
    setError("");

    const { error: deleteError } =
      await supabase
        .from("activities")
        .delete()
        .eq("id", activityId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setActivities((currentActivities) => ({
      ...currentActivities,

      [date]: (
        currentActivities[date] || []
      ).filter(
        (activity) =>
          activity.id !== activityId
      ),
    }));
  }

  return (
    <section className="itinerary-section">
      <div className="itinerary-heading">
        <p className="itinerary-label">
          Plan each day
        </p>

        <h2>Your itinerary</h2>

        <span>
          {location.name}, {location.country}
        </span>
      </div>

      {!tripId && (
        <p className="itinerary-save-notice">
          Save your trip before adding activities.
        </p>
      )}

      {error && (
        <p className="itinerary-error">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="itinerary-loading">
          Loading activities...
        </p>
      ) : (
        <div className="itinerary-days">
          {tripDates.map((date, index) => (
            <ItineraryDay
              key={date}
              date={date}
              dayNumber={index + 1}
              formattedDate={formatTripDate(
                date
              )}
              activities={
                activities[date] || []
              }
              canAddActivities={Boolean(tripId)}
              onAddActivity={addActivity}
              onDeleteActivity={
                deleteActivity
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Itinerary;