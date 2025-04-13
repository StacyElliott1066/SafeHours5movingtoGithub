export const getLocalDate = () => {
  return new Date().toLocaleDateString("en-CA");
};

export const getPreviousDate = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const prev = new Date(y, m - 1, d);
  prev.setDate(prev.getDate() - 1);
  return prev.toISOString().split("T")[0];
};

export const convertToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const formatTime24 = (timeStr) => {
  if (!timeStr) return "--:--";
  const [h, m] = timeStr.split(":");
  return `${h.padStart(2, "0")}:${m}`;
};

export const formatLocalDate = (dateStr) => {
  const d = new Date(dateStr + "T12:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
};
