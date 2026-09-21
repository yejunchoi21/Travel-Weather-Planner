import { useState } from "react";
import "./Home.css";

/*
  Converts Open-Meteo weather codes
  into readable descriptions.
*/
function getWeatherDescription(code) {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";

  if (code === 45 || code === 48) {
    return "Foggy";
  }

  if (code >= 51 && code <= 57) {
    return "Drizzle";
  }

  if (code >= 61 && code <= 67) {
    return "Rain";
  }

  if (code >= 71 && code <= 77) {
    return "Snow";
  }

  if (code >= 80 && code <= 82) {
    return "Rain showers";
  }

  if (code >= 85 && code <= 86) {
    return "Snow showers";
  }

  if (code >= 95 && code <= 99) {
    return "Thunderstorm";
  }

  return "Unknown";
}

function Home() {
  // Saves what the user types
  const [city, setCity] = useState("");

  // Saves information about the city
  const [location, setLocation] = useState(null);

  // Saves the current weather
  const [weather, setWeather] = useState(null);

  // Saves the seven-day forecast
  const [forecast, setForecast] = useState(null);

  // Tracks whether the search is loading
  const [isLoading, setIsLoading] = useState(false);

  // Saves an error message
  const [error, setError] = useState("");

  // Runs when the user submits the search form
  async function handleSearch(event) {
    // Prevents the page from refreshing
    event.preventDefault();

    // Removes an old error message
    setError("");

    // Stops the search when the input is empty
    if (city.trim() === "") {
      setError("Please enter a city.");
      return;
    }

    // Changes the button to “Searching...”
    setIsLoading(true);

    /*
      Searches for the city and returns
      its latitude and longitude.
    */
    const locationUrl =
      `https://geocoding-api.open-meteo.com/v1/search` +
      `?name=${encodeURIComponent(city)}` +
      `&count=1&language=en&format=json`;

    try {
      // Sends the city name to the location API
      const locationResponse = await fetch(locationUrl);

      // Checks whether the location request worked
      if (!locationResponse.ok) {
        throw new Error("Location request failed.");
      }

      // Converts the response into JavaScript data
      const locationData = await locationResponse.json();

      // Runs when no city is found
      if (!locationData.results?.length) {
        setError(
          "City not found. Please check the spelling."
        );
        return;
      }

      // Selects the first city from the results
      const selectedLocation =
        locationData.results[0];

      // Gets the city coordinates
      const latitude = selectedLocation.latitude;
      const longitude = selectedLocation.longitude;

      /*
        Requests:
        - Current weather
        - Seven-day forecast
        - Daily high temperatures
        - Daily low temperatures
      */
      const weatherUrl =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
        `&forecast_days=7` +
        `&timezone=auto`;

      // Sends the city coordinates to the weather API
      const weatherResponse = await fetch(weatherUrl);

      // Checks whether the weather request worked
      if (!weatherResponse.ok) {
        throw new Error("Weather request failed.");
      }

      // Converts the response into JavaScript data
      const weatherData = await weatherResponse.json();

      // Saves all the results
      setLocation(selectedLocation);
      setWeather(weatherData.current);
      setForecast(weatherData.daily);
    } catch (requestError) {
      console.error(requestError);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      /*
        Always stops loading when the search finishes,
        whether it succeeds or fails.
      */
      setIsLoading(false);
    }
  }

  return (
    <main className="home-page">
      <section className="home-hero">
        <h1>TripCast</h1>

        <p>
          Plan your trip with accurate weather forecasts.
        </p>

        <form
          className="city-search"
          onSubmit={handleSearch}
        >
          <label htmlFor="city">
            Where are you travelling?
          </label>

          <div className="search-controls">
            <input
              id="city"
              type="text"
              placeholder="Enter a city"
              value={city}
              onChange={(event) =>
                setCity(event.target.value)
              }
            />

            <button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Only appears when there is an error */}
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}
        </form>

        {/* Current weather */}
        {location && weather && (
          <section className="weather-card">
            <h2>
              {location.name}, {location.country}
            </h2>

            <p className="temperature">
              {weather.temperature_2m}°C
            </p>

            <div className="weather-details">
              <p>
                Feels like:{" "}
                {weather.apparent_temperature}°C
              </p>

              <p>
                Humidity:{" "}
                {weather.relative_humidity_2m}%
              </p>

              <p>
                Wind speed:{" "}
                {weather.wind_speed_10m} km/h
              </p>

              <p>
                Conditions:{" "}
                {getWeatherDescription(
                  weather.weather_code
                )}
              </p>
            </div>
          </section>
        )}

        {/* Seven-day forecast */}
        {forecast && (
          <section className="forecast-section">
            <h2>7-Day Forecast</h2>

            <div className="forecast-grid">
              {forecast.time.map((date, index) => {
                // Converts the API date into a JavaScript date
                const selectedDate = new Date(
                  `${date}T00:00:00`
                );

                // Creates a short day name such as “Mon”
                const dayName =
                  selectedDate.toLocaleDateString(
                    "en-CA",
                    {
                      weekday: "short",
                    }
                  );

                // Creates a date such as “Sep 21”
                const formattedDate =
                  selectedDate.toLocaleDateString(
                    "en-CA",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  );

                return (
                  <article
                    className="forecast-card"
                    key={date}
                  >
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
        )}
      </section>
    </main>
  );
}

export default Home;