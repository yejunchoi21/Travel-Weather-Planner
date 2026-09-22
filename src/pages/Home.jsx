import { useState } from "react";
import SearchForm from "../components/SearchForm";
import CurrentWeather from "../components/CurrentWeather";
import TripSummary from "../components/TripSummary";
import Forecast from "../components/Forecast";
import Itinerary from "../components/Itinerary";
import "./Home.css";

function Home() {
  // City typed into the search box
  const [city, setCity] = useState("");

  // Selected trip dates
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Information returned by the APIs
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Runs when the search form is submitted
  async function handleSearch(event) {
    event.preventDefault();

    // Removes an old error
    setError("");

    // Checks that a city was entered
    if (city.trim() === "") {
      setError("Please enter a city.");
      return;
    }

    // Both trip dates must be selected together
    if (
      (startDate && !endDate) ||
      (!startDate && endDate)
    ) {
      setError(
        "Please select both an arrival and departure date."
      );
      return;
    }

    // Departure cannot be before arrival
    if (
      startDate &&
      endDate &&
      endDate < startDate
    ) {
      setError(
        "Departure date cannot be before arrival date."
      );
      return;
    }

    // Starts the loading state
    setIsLoading(true);

    // API address used to find the city
    const locationUrl =
      `https://geocoding-api.open-meteo.com/v1/search` +
      `?name=${encodeURIComponent(city)}` +
      `&count=1&language=en&format=json`;

    try {
      // First request: find the city
      const locationResponse = await fetch(locationUrl);

      if (!locationResponse.ok) {
        throw new Error("Location request failed.");
      }

      const locationData =
        await locationResponse.json();

      // Runs when the city cannot be found
      if (!locationData.results?.length) {
        setError(
          "City not found. Please check the spelling."
        );
        return;
      }

      // Selects the first matching city
      const selectedLocation =
        locationData.results[0];

      const latitude = selectedLocation.latitude;
      const longitude = selectedLocation.longitude;

      // API address used to request the weather
      const weatherUrl =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
        `&forecast_days=7` +
        `&timezone=auto`;

      // Second request: find the weather
      const weatherResponse = await fetch(weatherUrl);

      if (!weatherResponse.ok) {
        throw new Error("Weather request failed.");
      }

      const weatherData =
        await weatherResponse.json();

      // Saves all API results
      setLocation(selectedLocation);
      setWeather(weatherData.current);
      setForecast(weatherData.daily);
    } catch (requestError) {
      console.error(requestError);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      // Stops the loading state
      setIsLoading(false);
    }
  }

  return (
    <main className="home-page">
      <section className="home-layout">
        {/* Left side of the page */}
        <div className="home-intro">
          <h1>TripCast</h1>

          <p>
            Plan your trip with accurate weather
            forecasts.
          </p>
        </div>

        {/* Search area */}
        <div className="home-search-area">
          <SearchForm
            city={city}
            setCity={setCity}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            isLoading={isLoading}
            error={error}
            onSubmit={handleSearch}
          />
        </div>

        {/* Current weather area */}
        <div className="home-weather-area">
          <CurrentWeather
            location={location}
            weather={weather}
          />
        </div>

        {/* Trip summary area */}
        <div className="home-trip-area">
          <TripSummary
            location={location}
            startDate={startDate}
            endDate={endDate}
          />
        </div>

        {/* Seven-day forecast area */}
        <div className="home-forecast-area">
          <Forecast
            forecast={forecast}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        <div className="home-itinerary-area">
            <Itinerary
                location={location}
                startDate={startDate}
                endDate={endDate}
            />
        </div>
      </section>
    </main>
  );
}

export default Home;