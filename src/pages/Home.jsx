import { useEffect, useState } from "react";
import SearchForm from "../components/SearchForm";
import CurrentWeather from "../components/CurrentWeather";
import TripSummary from "../components/TripSummary";
import Forecast from "../components/Forecast";
import Itinerary from "../components/Itinerary";
import PackingList from "../components/PackingList";
import SaveTripButton from "../components/SaveTripButton";
import "./Home.css";

function Home({ initialTrip }) {
  const [city, setCity] = useState(
    initialTrip?.city || ""
  );

  const [startDate, setStartDate] = useState(
    initialTrip?.start_date || ""
  );

  const [endDate, setEndDate] = useState(
    initialTrip?.end_date || ""
  );

  const [location, setLocation] = useState(
    initialTrip
      ? {
          name: initialTrip.city,
          country: initialTrip.country,
          latitude: initialTrip.latitude,
          longitude: initialTrip.longitude,
        }
      : null
  );

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] =
    useState(null);

  const [savedTrip, setSavedTrip] = useState(
    initialTrip || null
  );

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] = useState("");

  async function getWeather(latitude, longitude) {
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
    );

    if (!weatherResponse.ok) {
      throw new Error(
        "Unable to retrieve weather information."
      );
    }

    return weatherResponse.json();
  }

  // Load fresh weather when opening a saved trip
  useEffect(() => {
    if (!initialTrip) {
      return;
    }

    async function loadSavedTripWeather() {
      setIsLoading(true);
      setError("");

      try {
        const weatherData = await getWeather(
          initialTrip.latitude,
          initialTrip.longitude
        );

        setWeather(weatherData.current);
        setForecast(weatherData.daily);
      } catch (weatherError) {
        setError(
          weatherError.message ||
            "Unable to load the trip weather."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadSavedTripWeather();
  }, [initialTrip]);

  async function handleSearch(event) {
    event.preventDefault();

    setError("");
    setSavedTrip(null);

    if (!city.trim()) {
      setError("Please enter a city.");
      return;
    }

    if (
      (startDate && !endDate) ||
      (!startDate && endDate)
    ) {
      setError(
        "Please select both arrival and departure dates."
      );
      return;
    }

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

    setIsLoading(true);

    try {
      const geocodingResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city.trim()
        )}&count=1&language=en&format=json`
      );

      if (!geocodingResponse.ok) {
        throw new Error(
          "Unable to search for that city."
        );
      }

      const geocodingData =
        await geocodingResponse.json();

      if (
        !geocodingData.results ||
        geocodingData.results.length === 0
      ) {
        throw new Error(
          "City not found. Check the spelling and try again."
        );
      }

      const selectedLocation =
        geocodingData.results[0];

      const weatherData = await getWeather(
        selectedLocation.latitude,
        selectedLocation.longitude
      );

      setLocation({
        name: selectedLocation.name,
        country:
          selectedLocation.country ||
          "Unknown country",
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });

      setWeather(weatherData.current);
      setForecast(weatherData.daily);
    } catch (searchError) {
      setLocation(null);
      setWeather(null);
      setForecast(null);

      setError(
        searchError.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="home-page">
      <section className="home-layout">
        <header className="home-intro">
          <p className="home-eyebrow">
            Weather-based travel planner
          </p>

          <h1>TripCast</h1>

          <p className="home-subtitle">
            Plan your trip with accurate weather
            forecasts.
          </p>
        </header>

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

        <div className="home-weather-area">
          <CurrentWeather
            location={location}
            weather={weather}
          />
        </div>

        <div className="home-trip-area">
          <TripSummary
            location={location}
            startDate={startDate}
            endDate={endDate}
          />
        </div>

        <div className="home-forecast-area">
          <Forecast
            forecast={forecast}
            startDate={startDate}
            endDate={endDate}
          />
        </div>

        <div className="home-save-area">
          {savedTrip ? (
            <div className="home-saved-trip-message">
              <span>✓</span>
              This trip is saved to your account.
            </div>
          ) : (
            <SaveTripButton
              location={location}
              startDate={startDate}
              endDate={endDate}
              onTripSaved={setSavedTrip}
            />
          )}
        </div>

        <div className="home-itinerary-area">
          <Itinerary
            location={location}
            startDate={startDate}
            endDate={endDate}
            tripId={savedTrip?.id}
          />
        </div>

        <div className="home-packing-area">
          <PackingList
            location={location}
            startDate={startDate}
            endDate={endDate}
            tripId={savedTrip?.id}
          />
        </div>
      </section>
    </main>
  );
}

export default Home;