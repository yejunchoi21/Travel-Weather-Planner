import { getWeatherDescription } from "../utils/weather";
import "./Forecast.css";

function Forecast({
  forecast,
  startDate,
  endDate,
}) {
  // Displays nothing before forecast data is available
  if (!forecast) {
    return null;
  }

  // First and last available forecast dates
  const firstForecastDate = forecast.time[0];

  const lastForecastDate =
    forecast.time[forecast.time.length - 1];

  /*
    Checks whether any part of the trip
    is inside the available forecast.
  */
  const tripHasForecast =
    startDate &&
    endDate &&
    startDate <= lastForecastDate &&
    endDate >= firstForecastDate;

  return (
    <section className="forecast-section">
      <h2>7-Day Forecast</h2>

      {/* Appears when the trip is outside the forecast */}
      {startDate &&
        endDate &&
        !tripHasForecast && (
          <div className="forecast-unavailable">
            <strong>
              Your trip forecast is not available yet.
            </strong>

            <p>
              Check again closer to your arrival date.
            </p>
          </div>
        )}

      <div className="forecast-grid">
        {forecast.time.map((date, index) => {
          // Converts the API date into a JavaScript date
          const selectedDate = new Date(
            `${date}T00:00:00`
          );

          // Creates a day name such as “Mon”
          const dayName =
            selectedDate.toLocaleDateString(
              "en-CA",
              {
                weekday: "short",
              }
            );

          // Creates a date such as “Sep 22”
          const formattedDate =
            selectedDate.toLocaleDateString(
              "en-CA",
              {
                month: "short",
                day: "numeric",
              }
            );

          /*
            True when this forecast date is
            between the selected trip dates.
          */
          const isTripDay =
            startDate &&
            endDate &&
            date >= startDate &&
            date <= endDate;

          return (
            <article
              className={
                isTripDay
                  ? "forecast-card trip-day"
                  : "forecast-card"
              }
              key={date}
            >
              {/* Only appears on selected trip days */}
              {isTripDay && (
                <span className="trip-day-label">
                  Trip day
                </span>
              )}

              <h3>{dayName}</h3>

              <p className="forecast-date">
                {formattedDate}
              </p>

              <p className="forecast-condition">
                {getWeatherDescription(
                  forecast.weather_code[index]
                )}
              </p>

              <div className="forecast-temperatures">
                <span className="forecast-high">
                  {Math.round(
                    forecast
                      .temperature_2m_max[index]
                  )}
                  °C
                </span>

                <span className="forecast-low">
                  {Math.round(
                    forecast
                      .temperature_2m_min[index]
                  )}
                  °C
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Forecast;