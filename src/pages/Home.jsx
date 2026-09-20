import { useState } from "react";
import "./Home.css";

function Home() {
  // Stores whatever city the user types
  const [city, setCity] = useState("");

  // Runs when the user submits the search form
async function handleSearch(event) {
  event.preventDefault();

  if (city.trim() === "") {
    alert("Please enter a city.");
    return;
  }

  const url =
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results) {
      alert("City not found.");
      return;
    }

    const location = data.results[0];

    console.log(location);
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
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

            <button type="submit">
              Search
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Home;