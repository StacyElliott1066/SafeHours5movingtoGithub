import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

// 🎨 Match Timeline Colors
const COLORS = {
  Flight: "BLUE", // Blue
  "SIM/ATD": "PURPLE", // Purple
  Ground: "BROWN", // Brown
  "Other Sched. Act.": "bLACK", // Gray
  PrePost: "#355E3B", // gREEN
};

// 🧠 Get "Sun", "Mon", "Tue", ...
const getDayLabel = (dateStr) => {
  const date = new Date(`${dateStr}T12:00:00`);
  const day = date.getDay();
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return labels[day];
};

// 🧠 Tooltip Content
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #ccc",
        padding: "10px",
        fontSize: "12px",
      }}
    >
      <strong>{label}</strong>
      <br />
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.fill }}>
          {p.name}: {p.value.toFixed(1)} hrs
        </div>
      ))}
    </div>
  );
};

const Weekly = ({
  weeklyData,
  breakdown,
  avgDaily,
  percentChange,
  totalHours,
}) => {
  const allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayMap = {};

  // Re-map each entry by day label
  weeklyData.forEach((d) => {
    const label = getDayLabel(d.date);
    dayMap[label] = {
      name: label,
      Flight: d.Flight || 0,
      "SIM/ATD": d["SIM/ATD"] || 0,
      Ground: d.Ground || 0,
      "Other Sched. Act.": d["Other Sched. Act."] || 0,
      PrePost: d.PrePost || 0,
    };
  });

  // Always return full week (even if 0s)
  const data = allDays.map((label) => ({
    name: label,
    Flight: dayMap[label]?.Flight || 0,
    "SIM/ATD": dayMap[label]?.["SIM/ATD"] || 0,
    Ground: dayMap[label]?.Ground || 0,
    "Other Sched. Act.": dayMap[label]?.["Other Sched. Act."] || 0,
    PrePost: dayMap[label]?.PrePost || 0,
  }));

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        margin: "120px auto 0", // ✅ centers horizontally
        padding: "0 0px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "3px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
            Daily Average
          </div>
          <div style={{ fontSize: "24px" }}>{avgDaily.toFixed(1)}</div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "14px",
            backgroundColor: "#eee",
            padding: "6px 12px",
            borderRadius: "20px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)", // 🔥 Add this line
          }}
        >
          <span style={{ fontSize: "18px" }}>
            {percentChange >= 0 ? "📈" : "📉"}
          </span>
          <span>{Math.abs(percentChange).toFixed(1)}% from last week</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis domain={[0, 18]} tickFormatter={(val) => `${val}h`} />

          <ReferenceLine
            y={avgDaily}
            stroke="#3399FF"
            strokeDasharray="3 3"
            label={{
              value: "avg",
              position: "left",
              fill: "#3399FF",
              fontSize: 12,
            }}
          />
          {["Flight", "SIM/ATD", "Ground", "Other Sched. Act.", "PrePost"].map(
            (key) => (
              <Bar key={key} dataKey={key} stackId="a" fill={COLORS[key]} />
            )
          )}
        </BarChart>
      </ResponsiveContainer>
      {/* Legend and Totals */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: "3px",
          padding: "10px 0",
          flexWrap: "wrap",
          gap: "30px",
        }}
      >
        {/* 🧩 Breakdown List */}
        <div
          style={{
            display: "flex",
            fontWeight: "bold",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <span style={{ color: COLORS["Flight"], fontWeight: "bold" }}>
            <strong>FLT INST.</strong>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
            {breakdown["Flight"].toFixed(1)}
          </span>
          <span style={{ color: COLORS["SIM/ATD"], fontWeight: "bold" }}>
            <strong>SIM/ATD</strong>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
            {breakdown["SIM/ATD"].toFixed(1)}
          </span>
          <span style={{ color: COLORS["Ground"], fontWeight: "bold" }}>
            <strong>GROUND</strong>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
            {breakdown["Ground"].toFixed(1)}
          </span>
          <span
            style={{
              color: COLORS["PrePost"],
              opacity: 1,
              fontWeight: "bold",
            }}
          >
            <strong>PRE/POST</strong>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
            {breakdown["PrePost"].toFixed(1)}
          </span>
          <span
            style={{
              color: COLORS["Other Sched. Act."],
              opacity: 1,
              fontWeight: "bold",
            }}
          >
            <strong>OTHER SCHD.</strong>&nbsp;&nbsp;{" "}
            {breakdown["Other Sched. Act."].toFixed(1)}
          </span>
        </div>

        {/* ✅ Total Box with Dynamic Color */}
        <div
          onClick={() =>
            alert(
              `Overtime is defined in the UND Aerospace Employee Handbook as time actual time worked in excess of
40 hours in a standard workweek (12:00 am Sunday through 11:59 pm Saturday).

It is the responsibility of the Flight Instructor to monitor their individual contact and administrative time in a
standard workweek. Instructors must cease work at 40 hours of time (contact and administrative time
combined) unless prior authorization was received in writing.

Overtime requests must be made via UNDAF email to the Chief Flight Instructor by noon on Fridays.
Requests must be approved prior to working beyond 40 hours. Violations of this policy will result in
disciplinary action.`
            )
          }
          style={{
            border: "2px solid black",
            borderRadius: "10px",
            padding: "12px 18px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "16px",
            minWidth: "140px",
            cursor: "pointer",
            backgroundColor:
              totalHours >= 40
                ? "#8B0000"
                : totalHours >= 35
                ? "#B8860B"
                : "white",
            color: totalHours >= 35 ? "white" : "black",
          }}
        >
          Total Hours
          <br />
          This Week
          <br />
          <span style={{ fontSize: "22px" }}>{totalHours.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default Weekly;
