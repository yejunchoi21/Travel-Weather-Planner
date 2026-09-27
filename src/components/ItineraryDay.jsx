import { useState } from "react";
import "./ItineraryDay.css";

function ItineraryDay({
  date,
  dayNumber,
  formattedDate,
  activities = [],
  canAddActivities,
  onAddActivity,
  onDeleteActivity,
}) {
  const [isAdding, setIsAdding] =
    useState(false);

  const [activityName, setActivityName] =
    useState("");

  const [activityTime, setActivityTime] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedName =
      activityName.trim();

    if (!trimmedName) {
      return;
    }

    setIsSaving(true);

    try {
      const wasSaved =
        await onAddActivity(date, {
          name: trimmedName,
          time: activityTime,
        });

      if (wasSaved) {
        setActivityName("");
        setActivityTime("");
        setIsAdding(false);
      }
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setActivityName("");
    setActivityTime("");
    setIsAdding(false);
  }

  return (
    <article className="itinerary-day">
      <div className="itinerary-day-header">
        <p className="itinerary-day-number">
          Day {dayNumber}
        </p>

        <h3>{formattedDate}</h3>
      </div>

      {activities.length === 0 ? (
        <p className="itinerary-empty">
          No activities added yet.
        </p>
      ) : (
        <ul className="activity-list">
          {activities.map((activity) => (
            <li
              className="activity-item"
              key={activity.id}
            >
              <div className="activity-details">
                <span className="activity-time">
                  {activity.time ||
                    "Any time"}
                </span>

                <span className="activity-name">
                  {activity.name}
                </span>
              </div>

              <button
                className="delete-activity-button"
                type="button"
                onClick={() =>
                  onDeleteActivity(
                    date,
                    activity.id
                  )
                }
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {isAdding ? (
        <form
          className="activity-form"
          onSubmit={handleSubmit}
        >
          <div className="activity-form-field">
            <label htmlFor={`time-${date}`}>
              Time
            </label>

            <input
              id={`time-${date}`}
              type="time"
              value={activityTime}
              onChange={(event) =>
                setActivityTime(
                  event.target.value
                )
              }
            />
          </div>

          <div className="activity-form-field activity-name-field">
            <label
              htmlFor={`activity-${date}`}
            >
              Activity
            </label>

            <input
              id={`activity-${date}`}
              type="text"
              value={activityName}
              placeholder="Example: Visit the museum"
              maxLength="100"
              onChange={(event) =>
                setActivityName(
                  event.target.value
                )
              }
            />
          </div>

          <div className="activity-form-buttons">
            <button
              className="cancel-activity-button"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              className="save-activity-button"
              type="submit"
              disabled={
                isSaving ||
                !activityName.trim()
              }
            >
              {isSaving
                ? "Saving..."
                : "Add"}
            </button>
          </div>
        </form>
      ) : (
        <button
          className="add-activity-button"
          type="button"
          disabled={!canAddActivities}
          onClick={() => {
            if (canAddActivities) {
              setIsAdding(true);
            }
          }}
        >
          + Add activity
        </button>
      )}

      {!canAddActivities && (
        <p className="activity-save-reminder">
          Save this trip before adding
          activities.
        </p>
      )}
    </article>
  );
}

export default ItineraryDay;