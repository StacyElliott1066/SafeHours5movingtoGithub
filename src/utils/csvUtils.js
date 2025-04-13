export const downloadActivities = (activities) => {
  if (!activities.length) {
    alert("No data available to download.");
    return;
  }

  const headers = [
    "Date",
    "Start",
    "End",
    "Duration",
    "Pre/Post",
    "Activity",
    "Note",
  ];

  const rows = activities.map((a) =>
    [
      a.date,
      a.start,
      a.end,
      a.duration,
      a.prePost || "0",
      a.activity,
      a.note || "",
    ].join(",")
  );

  const blob = new Blob([headers.join(",") + "\n" + rows.join("\n")], {
    type: "text/csv",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "SafeHours_Activities.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
