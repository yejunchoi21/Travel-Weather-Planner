import { useState } from "react";
import "./PackingList.css";

function PackingList({ location, startDate, endDate }) {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");

  if (!location || !startDate || !endDate) {
    return null;
  }

  const packedItems = items.filter(
    (item) => item.isPacked
  ).length;

  function handleSubmit(event) {
    event.preventDefault();

    if (!itemName.trim()) {
      return;
    }

    const newItem = {
      id: crypto.randomUUID(),
      name: itemName.trim(),
      isPacked: false,
    };

    setItems((currentItems) => [
      ...currentItems,
      newItem,
    ]);

    setItemName("");
  }

  function toggleItem(itemId) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              isPacked: !item.isPacked,
            }
          : item
      )
    );
  }

  function deleteItem(itemId) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== itemId
      )
    );
  }

  return (
    <section className="packing-section">
      <div className="packing-heading">
        <p className="packing-label">
          Trip essentials
        </p>

        <h2>Packing List</h2>

        <p>
          Keep track of everything you need for your
          trip to {location.name}.
        </p>
      </div>

      <div className="packing-progress">
        <div className="packing-progress-text">
          <span>Progress</span>

          <strong>
            {packedItems} of {items.length} packed
          </strong>
        </div>

        <div className="packing-progress-bar">
          <div
            className="packing-progress-fill"
            style={{
              width:
                items.length === 0
                  ? "0%"
                  : `${
                      (packedItems / items.length) *
                      100
                    }%`,
            }}
          />
        </div>
      </div>

      <form
        className="packing-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Add an item, such as Passport"
          value={itemName}
          onChange={(event) =>
            setItemName(event.target.value)
          }
        />

        <button type="submit">
          Add item
        </button>
      </form>

      {items.length === 0 ? (
        <p className="packing-empty">
          Your packing list is empty.
        </p>
      ) : (
        <ul className="packing-list">
          {items.map((item) => (
            <li
              className={
                item.isPacked
                  ? "packing-item packed"
                  : "packing-item"
              }
              key={item.id}
            >
              <label>
                <input
                  type="checkbox"
                  checked={item.isPacked}
                  onChange={() =>
                    toggleItem(item.id)
                  }
                />

                <span>{item.name}</span>
              </label>

              <button
                className="packing-delete-button"
                type="button"
                onClick={() =>
                  deleteItem(item.id)
                }
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default PackingList;