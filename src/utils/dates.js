/*
  Calculates the number of nights between
  the arrival and departure dates.
*/
export function getTripLength(
  startDate,
  endDate
) {
  if (!startDate || !endDate) {
    return 0;
  }

  const arrival = new Date(
    `${startDate}T00:00:00Z`
  );

  const departure = new Date(
    `${endDate}T00:00:00Z`
  );

  const difference =
    departure.getTime() - arrival.getTime();

  return Math.round(
    difference / (1000 * 60 * 60 * 24)
  );
}

/*
  Changes 2026-09-25 into Sep 25, 2026.
*/
export function formatTripDate(date) {
  if (!date) {
    return "";
  }

  return new Date(
    `${date}T00:00:00Z`
  ).toLocaleDateString("en-CA", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/*
  Creates every date from arrival to departure.

  Example:
  Sep 25 → Sep 28

  Returns:
  Sep 25, Sep 26, Sep 27, Sep 28
*/
export function getTripDates(
  startDate,
  endDate
) {
  if (!startDate || !endDate) {
    return [];
  }

  const dates = [];

  const currentDate = new Date(
    `${startDate}T00:00:00Z`
  );

  const finalDate = new Date(
    `${endDate}T00:00:00Z`
  );

  while (currentDate <= finalDate) {
    dates.push(
      currentDate.toISOString().split("T")[0]
    );

    currentDate.setUTCDate(
      currentDate.getUTCDate() + 1
    );
  }

  return dates;
}