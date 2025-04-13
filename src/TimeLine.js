import React from "react";

const LEFT_OFFSET = -1;

const COLORS = {
  Flight: "",
  Ground: "brown",
  "SIM/ATD": "purple",
  "Other Sched. Act.": "gray",
};

const timeToNumeric = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};

const Timeline = ({ timelineData }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "calc(100% - 6px)",
        margin: "0 auto",
        height: "80px",
        border: "1px solid black",
        backgroundColor: "#355E3B",
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
                backgroundColor: "#355E3B",
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
                backgroundColor: COLORS[activity.activity] || "#355E3B",
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
                  color: "RED",
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
  );
};

export default Timeline;
