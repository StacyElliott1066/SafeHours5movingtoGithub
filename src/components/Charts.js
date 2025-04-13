import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

// Define Colors for Activities
const COLORS = {
  Flight: "blue",
  Ground: "brown",
  "SIM/ATD": "purple",
  "Other Sched. Act.": "bLACK",
};

// Convert Time (HH:MM) to Numeric Scale (00:00 - 24:00)
const timeToNumeric = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};

const Charts = ({
  activityData,
  timelineData,
  flightHours,
  consecutiveDays,
}) => {
  // Define a small offset for the left positioning
  const LEFT_OFFSET = -1; // Adjust this value to fine-tune the positioning

  const getBarPosition = (value, max = 9) => {
    const clamped = Math.min(value, max);
    const percentage = (clamped / max) * 100;
    return `${percentage}%`;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "calc(100% - 6px)",
        marginLeft: "3px",
        marginRight: "3px",
        marginTop: "10px",
      }}
    >
      {/* Timeline Chart */}
      <div
        style={{
          position: "relative",
          width: "calc(100% - 6px)",
          margin: "0 auto",
          height: "80px",
          border: "1px solid black",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "3px",
            width: "calc(100% - 6px)",
            height: "2px",
            backgroundColor: "black",
            transform: "translateY(-50%)",
          }}
        />

        {[...Array(13)].map((_, i) => {
          const hour = i * 2;
          const leftPosition = (hour / 24) * 100;
          return (
            <React.Fragment key={hour}>
              <div
                style={{
                  position: "absolute",
                  left: `calc(${leftPosition}% - 1px)`,
                  top: "50%",
                  width: "1px",
                  height: "8px",
                  backgroundColor: "black",
                  transform: "translateY(-50%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: `calc(${leftPosition}% - 1px)`,
                  bottom: "10px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                  padding: "2px 4px",
                  textAlign: "center",
                  transform: "translateX(-50%)",
                }}
              >
                {hour.toString().padStart(2, "0")}
              </div>
            </React.Fragment>
          );
        })}

        {timelineData.map((activity, index) => {
          const start = timeToNumeric(activity.start);
          const end = timeToNumeric(activity.end);
          const duration = end - start;
          const prePost = parseFloat(activity.prePost) || 0;
          const pre = prePost / 2;
          const post = prePost / 2;
          const preStart = start - pre;
          const postEnd = end + post;

          return (
            <React.Fragment key={index}>
              {pre > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: `calc(${(preStart / 24) * 100}% + ${LEFT_OFFSET}px)`,
                    width: `calc(${(pre / 24) * 100}%)`,
                    height: "20px",
                    backgroundColor: "#355E3B",
                    border: "1px solid black",
                    color: "white",
                    textAlign: "center",
                    fontSize: "10px",
                    lineHeight: "20px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "pointer",
                  }}
                  title={`Pre Time: ${pre} Hours`}
                >
                  Pre
                </div>
              )}

              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: `calc(${(start / 24) * 100}% + ${LEFT_OFFSET}px)`,
                  width: `calc(${(duration / 24) * 100}%)`,
                  height: "20px",
                  backgroundColor: COLORS[activity.activity] || "gray",
                  border: "1px solid black",
                  color: "white",
                  textAlign: "center",
                  fontSize: "10px",
                  lineHeight: "20px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "pointer",
                }}
                title={`Start: ${activity.start}, End: ${activity.end}`}
              >
                {activity.activity}
              </div>

              {post > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: `calc(${(end / 24) * 100}% + ${LEFT_OFFSET}px)`,
                    width: `calc(${(post / 24) * 100}%)`,
                    height: "20px",
                    backgroundColor: "#355E3B",
                    border: "1px solid black",
                    color: "white",
                    textAlign: "center",
                    fontSize: "10px",
                    lineHeight: "20px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    cursor: "pointer",
                  }}
                  title={`Post Time: ${post} Hours`}
                >
                  Post
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <h3
        style={{
          textAlign: "center",
          width: "100%",
          marginTop: "0px",
          marginBottom: "0px",
        }}
      >
        Target Date Timeline
      </h3>
    </div>
  );
};

export default Charts;
