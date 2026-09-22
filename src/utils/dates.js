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
    `${startDate}T00:00:00`
  );

  const departure = new Date(
    `${endDate}T00:00:00`
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
    `${date}T00:00:00`
  ).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}