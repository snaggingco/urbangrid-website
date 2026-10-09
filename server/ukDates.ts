const londonClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

/** Convert a calendar midnight, not a fixed 24-hour period, to UTC. */
export function londonDayBoundary(day: string, nextDay = false): Date {
  const midnight = new Date(`${day}T00:00:00Z`);
  if (Number.isNaN(midnight.getTime()) || midnight.toISOString().slice(0, 10) !== day) {
    throw new Error("Invalid calendar date");
  }
  if (nextDay) midnight.setUTCDate(midnight.getUTCDate() + 1);
  const target = midnight.getTime();
  let instant = target;
  for (let i = 0; i < 3; i++) {
    const parts = Object.fromEntries(londonClock.formatToParts(new Date(instant)).map(p => [p.type, p.value]));
    const wall = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
    instant = target - (wall - instant);
  }
  return new Date(instant);
}
