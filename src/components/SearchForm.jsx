import "./SearchForm.css";

function SearchForm({
  city,
  setCity,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isLoading,
  error,
  onSubmit,
}) {
  return (
    <form
      className="city-search"
      onSubmit={onSubmit}
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

      <div className="trip-dates">
        <div className="date-field">
          <label htmlFor="start-date">
            Arrival date
          </label>

          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(event) =>
              setStartDate(event.target.value)
            }
          />
        </div>

        <div className="date-field">
          <label htmlFor="end-date">
            Departure date
          </label>

          <input
            id="end-date"
            type="date"
            min={startDate}
            value={endDate}
            onChange={(event) =>
              setEndDate(event.target.value)
            }
          />
        </div>
      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}
    </form>
  );
}

export default SearchForm;