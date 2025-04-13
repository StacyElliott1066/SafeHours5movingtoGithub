export const calculateFlightHours = (activities, targetDate) => {
  return activities
    .filter((a) => a.date === targetDate && a.activity === "Flight")
    .map((a) => {
      const start = new Date(`${a.date}T${a.start}`);
      const end = new Date(`${a.date}T${a.end}`);
      return (end - start) / (1000 * 60 * 60);
    })
    .reduce((sum, hrs) => sum + hrs, 0);
};

export const calculateContactHours = (activities, targetDate) => {
  return activities
    .filter((a) => a.date === targetDate && a.activity !== "Other Sched. Act.")
    .map((a) => {
      const start = new Date(`${a.date}T${a.start}`);
      const end = new Date(`${a.date}T${a.end}`);
      const prePost = parseFloat(a.prePost) || 0;
      return (end - start) / (1000 * 60 * 60) + prePost;
    })
    .reduce((sum, hrs) => sum + hrs, 0);
};

export const calculatePast7DaysHours = (activities, targetDate) => {
  const target = new Date(targetDate);
  const pastWeekStart = new Date(target);
  pastWeekStart.setDate(target.getDate() - 6);

  const daily = activities.reduce((acc, a) => {
    const d = new Date(a.date);
    if (
      d >= pastWeekStart &&
      d <= target &&
      a.activity !== "Other Sched. Act."
    ) {
      const start = new Date(`${a.date}T${a.start}`);
      const end = new Date(`${a.date}T${a.end}`);
      const hrs = (end - start) / (1000 * 60 * 60);
      acc[a.date] = (acc[a.date] || 0) + hrs;
    }
    return acc;
  }, {});

  return Object.values(daily).reduce((sum, h) => sum + h, 0);
};

export const calculateDutyDay = (activities, targetDate) => {
  const dayActs = activities.filter((a) => a.date === targetDate);
  if (!dayActs.length) return 0;

  const sorted = [...dayActs].sort((a, b) => a.start.localeCompare(b.start));
  const firstStart = new Date(`${targetDate}T${sorted[0].start}`);
  const lastEnd = new Date(`${targetDate}T${sorted.at(-1).end}`);
  return Math.max(0, ((lastEnd - firstStart) / (1000 * 60 * 60)).toFixed(2));
};

export const calculateConsecutiveDays = (
  activities,
  targetDate,
  getPrevDate
) => {
  let count = 0;
  let current = targetDate;

  while (
    activities.some(
      (a) => a.date === current && a.activity !== "Other Sched. Act."
    )
  ) {
    count++;
    const prev = getPrevDate(current);
    if (
      !activities.some(
        (a) => a.date === prev && a.activity !== "Other Sched. Act."
      )
    ) {
      break;
    }
    current = prev;
  }

  return count;
};

export const calculateRestHours = (activities, targetDate, getPrevDate) => {
  const prevDate = getPrevDate(targetDate);
  if (!prevDate) return 0;

  const prevActs = activities.filter((a) => a.date === prevDate);
  const currActs = activities.filter((a) => a.date === targetDate);
  if (!prevActs.length || !currActs.length) return 0;

  const lastEnd = prevActs.reduce((latest, a) => {
    const end = new Date(`${a.date}T${a.end}`);
    const post = (parseFloat(a.prePost || "0") / 2) * 3600000;
    const adj = new Date(end.getTime() + post);
    return adj > latest ? adj : latest;
  }, new Date(0));

  const firstStart = currActs.reduce((earliest, a) => {
    const start = new Date(`${a.date}T${a.start}`);
    const pre = (parseFloat(a.prePost || "0") / 2) * 3600000;
    const adj = new Date(start.getTime() - pre);
    return adj < earliest ? adj : earliest;
  }, new Date("2099-01-01"));

  const rest = (firstStart - lastEnd) / 3600000;
  return Math.max(0, rest.toFixed(2));
};
