import { useState } from "react";
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
}) {
  const [activities, setActivities] = useState({});

  if (!location || !startDate || !endDate) {
    return null;
  }

  const tripDates = getTripDates(
    startDate,
    endDate
  );

  function addActivity(date, newActivity) {
    setActivities((currentActivities) => ({
      ...currentActivities,

      [date]: [
        ...(currentActivities[date] || []),
        newActivity,
      ],
    }));
  }

  function deleteActivity(date, activityId) {
    setActivities((currentActivities) => ({
      ...currentActivities,

      [date]: (currentActivities[date] || []).filter(
        (activity) => activity.id !== activityId
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

      <div className="itinerary-days">
        {tripDates.map((date, index) => (
          <ItineraryDay
            key={date}
            date={date}
            dayNumber={index + 1}
            formattedDate={formatTripDate(date)}
            activities={activities[date] || []}
            onAddActivity={addActivity}
            onDeleteActivity={deleteActivity}
          />
        ))}
      </div>
    </section>
  );
}

export default Itinerary;