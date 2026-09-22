import { useState } from "react";
import "./ItineraryDay.css";

function ItineraryDay({
  date,
  dayNumber,
  formattedDate,
  activities,
  onAddActivity,
  onDeleteActivity,
}) {
  const [showForm, setShowForm] = useState(false);
  const [activityName, setActivityName] =
    useState("");
  const [activityTime, setActivityTime] =
    useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!activityName.trim()) {
      return;
    }

    const newActivity = {
      id: crypto.randomUUID(),
      name: activityName.trim(),
      time: activityTime,
    };

    onAddActivity(date, newActivity);

    setActivityName("");
    setActivityTime("");
    setShowForm(false);
  }

  function handleCancel() {
    setActivityName("");
    setActivityTime("");
    setShowForm(false);
  }

  return (
    <article className="itinerary-day">
      <div className="itinerary-day-number">
        Day {dayNumber}
      </div>

      <h3>{formattedDate}</h3>

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
              <div className="activity-information">
                {activity.time && (
                  <span className="activity-time">
                    {activity.time}
                  </span>
                )}

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

      {!showForm ? (
        <button
          type="button"
          className="add-activity-button"
          onClick={() => setShowForm(true)}
        >
          + Add activity
        </button>
      ) : (
        <form
          className="activity-form"
          onSubmit={handleSubmit}
        >
          <div className="activity-fields">
            <label>
              <span>Time</span>

              <input
                type="time"
                value={activityTime}
                onChange={(event) =>
                  setActivityTime(
                    event.target.value
                  )
                }
              />
            </label>

            <label className="activity-name-field">
              <span>Activity</span>

              <input
                type="text"
                placeholder="Example: Visit the CN Tower"
                value={activityName}
                onChange={(event) =>
                  setActivityName(
                    event.target.value
                  )
                }
                autoFocus
              />
            </label>
          </div>

          <div className="activity-form-buttons">
            <button
              type="button"
              className="cancel-activity-button"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-activity-button"
            >
              Add
            </button>
          </div>
        </form>
      )}
    </article>
  );
}

export default ItineraryDay;