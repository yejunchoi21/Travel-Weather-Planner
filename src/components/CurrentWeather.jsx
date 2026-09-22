import { getWeatherDescription } from "../utils/weather";
import "./CurrentWeather.css";

function CurrentWeather({
  location,
  weather,
}) {
  /*
    Displays nothing before the user
    successfully searches for a city.
  */
  if (!location || !weather) {
    return null;
  }

  return (
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
  );
}

export default CurrentWeather;