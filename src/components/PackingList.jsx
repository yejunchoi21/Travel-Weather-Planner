import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./PackingList.css";

function PackingList({
  location,
  startDate,
  endDate,
  tripId,
}) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [isLoading, setIsLoading] =
    useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tripId) {
      setItems([]);
      return;
    }

    async function loadPackingItems() {
      setIsLoading(true);
      setError("");

      const { data, error: loadError } =
        await supabase
          .from("packing_items")
          .select("*")
          .eq("trip_id", tripId)
          .order("created_at", {
            ascending: true,
          });

      if (loadError) {
        setError(loadError.message);
      } else {
        setItems(data || []);
      }

      setIsLoading(false);
    }

    loadPackingItems();
  }, [tripId]);

  if (!location || !startDate || !endDate) {
    return null;
  }

  async function handleAddItem(event) {
    event.preventDefault();

    const trimmedItem = newItem.trim();

    if (!trimmedItem) {
      return;
    }

    if (!tripId) {
      setError(
        "Save your trip before adding packing items."
      );
      return;
    }

    setError("");

    const { data, error: addError } =
      await supabase
        .from("packing_items")
        .insert({
          trip_id: tripId,
          name: trimmedItem,
          is_packed: false,
        })
        .select()
        .single();

    if (addError) {
      setError(addError.message);
      return;
    }

    setItems((currentItems) => [
      ...currentItems,
      data,
    ]);

    setNewItem("");
  }

  async function handleToggleItem(item) {
    const newPackedValue = !item.is_packed;

    const { data, error: updateError } =
      await supabase
        .from("packing_items")
        .update({
          is_packed: newPackedValue,
        })
        .eq("id", item.id)
        .select()
        .single();

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((currentItem) =>
        currentItem.id === item.id
          ? data
          : currentItem
      )
    );
  }

  async function handleDeleteItem(itemId) {
    const { error: deleteError } =
      await supabase
        .from("packing_items")
        .delete()
        .eq("id", itemId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

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
          Get ready
        </p>

        <h2>Packing checklist</h2>

        <p>
          Keep track of everything you need for
          your trip to {location.name}.
        </p>
      </div>

      {!tripId && (
        <p className="packing-save-message">
          Save your trip before adding packing
          items.
        </p>
      )}

      {tripId && (
        <form
          className="packing-form"
          onSubmit={handleAddItem}
        >
          <label htmlFor="packing-item">
            New item
          </label>

          <div className="packing-form-controls">
            <input
              id="packing-item"
              type="text"
              value={newItem}
              onChange={(event) =>
                setNewItem(event.target.value)
              }
              placeholder="Example: Passport"
            />

            <button type="submit">
              Add item
            </button>
          </div>
        </form>
      )}

      {error && (
        <p className="packing-error">
          {error}
        </p>
      )}

      {isLoading && (
        <p className="packing-status">
          Loading packing items...
        </p>
      )}

      {!isLoading &&
        tripId &&
        items.length === 0 && (
          <p className="packing-empty">
            No packing items added yet.
          </p>
        )}

      {items.length > 0 && (
        <ul className="packing-list">
          {items.map((item) => (
            <li
              className={
                item.is_packed
                  ? "packing-item packed"
                  : "packing-item"
              }
              key={item.id}
            >
              <label>
                <input
                  type="checkbox"
                  checked={item.is_packed}
                  onChange={() =>
                    handleToggleItem(item)
                  }
                />

                <span>{item.name}</span>
              </label>

              <button
                className="packing-delete-button"
                type="button"
                onClick={() =>
                  handleDeleteItem(item.id)
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