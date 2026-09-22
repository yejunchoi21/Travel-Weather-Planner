import {
  formatTripDate,
  getTripLength,
} from "../utils/dates";

import "./TripSummary.css";

function TripSummary({
  location,
  startDate,
  endDate,
}) {
  /*
    Displays nothing until the city and
    both trip dates are available.
  */
  if (!location || !startDate || !endDate) {
    return null;
  }

  // Calculates the number of nights
  const tripLength =
    getTripLength(startDate, endDate);

  return (
    <section className="trip-summary">
      <p className="trip-summary-label">
        Your upcoming trip
      </p>

      <h2>
        {location.name}, {location.country}
      </h2>

      <p className="trip-summary-dates">
        {formatTripDate(startDate)}

        <span>→</span>

        {formatTripDate(endDate)}
      </p>

      <p className="trip-summary-length">
        {tripLength}{" "}
        {tripLength === 1 ? "night" : "nights"}
      </p>
    </section>
  );
}

export default TripSummary;