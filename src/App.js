import React, { useState, useEffect } from "react";

// Components
import HeaderBar from "./components/HeaderBar";
import AddActivityModal from "./components/AddActivityModal";
import ActivityTable from "./components/ActivityTable";
import WarningSection from "./components/WarningSection";
import HelpModal from "./components/HelpModal";
import Charts from "./components/Charts";
import Weekly from "./components/Weekly";
import SaveAndLoad from "./SaveAndLoad";

// Utils
import {
  calculateFlightHours,
  calculateContactHours,
  calculateDutyDay,
  calculateRestHours,
  calculatePast7DaysHours,
  calculateConsecutiveDays,
} from "./utils/calculations";

import {
  getLocalDate,
  getPreviousDate,
  convertToMinutes,
  formatTime24,
  formatLocalDate,
} from "./utils/timeUtils";

// Weekly logic utils
const getWeeklyBreakdown = (activities, targetDate) => {
  const target = new Date(targetDate);
  const dayOfWeek = target.getDay();
  const weekStart = new Date(target);
  weekStart.setDate(target.getDate() - dayOfWeek);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const breakdown = {
    Flight: 0,
    "SIM/ATD": 0,
    Ground: 0,
    "Other Sched. Act.": 0,
    PrePost: 0,
  };

  for (const a of activities) {
    const date = new Date(a.date);
    if (date >= weekStart && date <= weekEnd) {
      const start = new Date(`${a.date}T${a.start}`);
      const end = new Date(`${a.date}T${a.end}`);
      const hrs = (end - start) / 3600000;
      const pp = parseFloat(a.prePost || 0);

      if (a.activity in breakdown) breakdown[a.activity] += hrs;
      breakdown.PrePost += pp;
    }
  }

  return breakdown;
};

const calculateTotalWeekHours = (weeklyData) =>
  weeklyData.reduce(
    (sum, d) =>
      sum +
      (d.Flight || 0) +
      (d["SIM/ATD"] || 0) +
      (d.Ground || 0) +
      (d.PrePost || 0),
    0
  );

const calculateAverageDaily = (weeklyData) => {
  const total = calculateTotalWeekHours(weeklyData);
  const activeDays = weeklyData.filter(
    (d) => d.Flight || d["SIM/ATD"] || d.Ground || d.PrePost
  ).length;
  return activeDays === 0 ? 0 : total / activeDays;
};

const calculateWeekOverWeekChange = (activities, targetDate) => {
  const currentStart = new Date(targetDate);
  currentStart.setDate(currentStart.getDate() - 6);
  const currentEnd = new Date(targetDate);
  const prevEnd = new Date(currentStart);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - 6);

  const getSum = (start, end) =>
    activities.reduce((sum, a) => {
      const d = new Date(a.date);
      if (d >= start && d <= end && a.activity !== "Other Sched. Act.") {
        const s = new Date(`${a.date}T${a.start}`);
        const e = new Date(`${a.date}T${a.end}`);
        return sum + (e - s) / 3600000 + parseFloat(a.prePost || 0);
      }
      return sum;
    }, 0);

  const thisWeek = getSum(currentStart, currentEnd);
  const lastWeek = getSum(prevStart, prevEnd);
  return lastWeek === 0 ? 0 : ((thisWeek - lastWeek) / lastWeek) * 100;
};

function App() {
  const [activities, setActivities] = useState(() => {
    const data = localStorage.getItem("activities");
    return data ? JSON.parse(data) : [];
  });

  const [targetDate, setTargetDate] = useState(getLocalDate());
  const [showCharts, setShowCharts] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showSaveScreen, setShowSaveScreen] = useState(false);

  const [newActivity, setNewActivity] = useState({
    start: "",
    duration: "",
    activity: "Flight",
    note: "",
  });

  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(activities));
    document.body.style.backgroundColor = "tan";
  }, [activities]);

  const addActivity = () => {
    if (!newActivity.date || !newActivity.start || !newActivity.duration) {
      alert("Please fill out all fields.");
      return;
    }

    const start = new Date(`${newActivity.date}T${newActivity.start}`);
    const durationMs = parseFloat(newActivity.duration) * 3600000;
    const end = new Date(start.getTime() + durationMs);

    // Midnight of same day (local)
    const endMidnight = new Date(`${newActivity.date}T23:59:59`);
    if (end > endMidnight) {
      alert("Activity cannot go past midnight.");
      return;
    }

    const isOverlap = activities.some((a) => {
      if (a.date !== newActivity.date) return false;
      const aStart = new Date(`${a.date}T${a.start}`);
      const aEnd = new Date(`${a.date}T${a.end}`);
      return !(end <= aStart || start >= aEnd);
    });

    if (isOverlap) {
      alert("Time conflict detected!");
      return;
    }

    const formattedEnd = `${end.getHours().toString().padStart(2, "0")}:${end
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const fullActivity = {
      ...newActivity,
      date: newActivity.date,
      end: formattedEnd,
      prePost:
        ["Flight", "SIM/ATD"].includes(newActivity.activity) &&
        newActivity.prePost
          ? newActivity.prePost
          : "0",
    };

    const updated = [...activities, fullActivity].sort((a, b) => {
      const aTime = new Date(`${a.date}T${a.start}`);
      const bTime = new Date(`${b.date}T${b.start}`);
      return bTime - aTime;
    });

    setActivities(updated);
    setIsModalOpen(false);
  };

  // 🧱 EDIT HANDLER WITH MIDNIGHT GUARD
  const handleEditActivity = (index, field, value) => {
    const updated = [...activities];
    let item = { ...updated[index], [field]: value };

    if (["start", "end"].includes(field)) {
      const [h, m] = value.split(":");
      item[field] = `${h.padStart(2, "0")}:${m}`;

      if (item.start && item.end) {
        const start = new Date(`${item.date}T${item.start}`);
        const end = new Date(`${item.date}T${item.end}`);
        const endOfDay = new Date(item.date);
        endOfDay.setHours(23, 59, 59, 999);

        if (end > endOfDay) {
          alert("End time cannot go past midnight.");
          return;
        }

        if (end < start) {
          alert("End must be after start.");
          return;
        }

        item.duration = ((end - start) / 3600000).toFixed(1);
      }
    }

    if (field === "duration" && item.start) {
      const start = new Date(`${item.date}T${item.start}`);
      const durationMs = parseFloat(value) * 3600000;
      const end = new Date(start.getTime() + durationMs);
      const endOfDay = new Date(item.date);
      endOfDay.setHours(23, 59, 59, 999);

      if (end > endOfDay) {
        alert("Activity cannot go past midnight.");
        return;
      }

      const formattedEnd = `${end.getHours().toString().padStart(2, "0")}:${end
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      item.end = formattedEnd;
    }

    updated[index] = item;
    setActivities(updated);
  };

  const deleteActivity = (index) => {
    const updated = activities.filter((_, i) => i !== index);
    setActivities(updated);
  };

  const handleShowNote = (note) => alert(note || "No note");

  const flightHours = calculateFlightHours(activities, targetDate);
  const contactHours = calculateContactHours(activities, targetDate);
  const past7DaysHours = calculatePast7DaysHours(activities, targetDate);
  const dutyDay = calculateDutyDay(activities, targetDate);
  const restHours = calculateRestHours(activities, targetDate, getPreviousDate);
  const consecutiveDays = calculateConsecutiveDays(
    activities,
    targetDate,
    getPreviousDate
  );

  const getWeeklyData = () => {
    const target = new Date(targetDate);
    const dayOfWeek = target.getDay();
    const weekStart = new Date(target);
    weekStart.setDate(target.getDate() - dayOfWeek);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const map = {};

    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      const dateStr = day.toISOString().split("T")[0];
      map[dateStr] = {
        date: dateStr,
        Flight: 0,
        "SIM/ATD": 0,
        Ground: 0,
        "Other Sched. Act.": 0,
        PrePost: 0,
      };
    }

    for (const a of activities) {
      const d = new Date(a.date);
      if (d >= weekStart && d <= weekEnd) {
        const startTime = new Date(`${a.date}T${a.start}`);
        const endTime = new Date(`${a.date}T${a.end}`);
        const hrs = (endTime - startTime) / 3600000;
        const pp = parseFloat(a.prePost || 0);
        const dateStr = a.date;

        if (a.activity === "Flight") map[dateStr].Flight += hrs;
        else if (a.activity === "SIM/ATD") map[dateStr]["SIM/ATD"] += hrs;
        else if (a.activity === "Ground") map[dateStr].Ground += hrs;
        else if (a.activity === "Other Sched. Act.")
          map[dateStr]["Other Sched. Act."] += hrs;

        if (["Flight", "SIM/ATD"].includes(a.activity)) {
          map[dateStr].PrePost += pp;
        }
      }
    }

    return Object.values(map).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  };

  const weeklyData = getWeeklyData();
  const weeklyBreakdown = getWeeklyBreakdown(activities, targetDate);
  const avgDailyHours = calculateAverageDaily(weeklyData);
  const totalWeekHours = calculateTotalWeekHours(weeklyData);
  const weekPercentChange = calculateWeekOverWeekChange(activities, targetDate);

  const getActivityData = () => {
    const map = {};
    for (const a of activities) {
      const start = new Date(`${a.date}T${a.start}`);
      const end = new Date(`${a.date}T${a.end}`);
      const hrs = (end - start) / 3600000;
      map[a.activity] = map[a.activity] || { activity: a.activity, hours: 0 };
      map[a.activity].hours += hrs;
    }
    return Object.values(map);
  };

  if (showSaveScreen) {
    return (
      <SaveAndLoad
        activities={activities}
        setActivities={setActivities}
        returnToMain={() => setShowSaveScreen(false)}
      />
    );
  }

  return (
    <div>
      <HeaderBar
        targetDate={targetDate}
        setTargetDate={setTargetDate}
        setIsModalOpen={setIsModalOpen}
        setShowCharts={setShowCharts}
        showCharts={showCharts}
        setIsHelpOpen={setIsHelpOpen}
        setShowSaveScreen={setShowSaveScreen}
      />

      {isModalOpen && (
        <AddActivityModal
          newActivity={newActivity}
          setNewActivity={setNewActivity}
          addActivity={addActivity}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      {isHelpOpen && <HelpModal setIsHelpOpen={setIsHelpOpen} />}

      {showCharts ? (
        <>
          <Weekly
            weeklyData={weeklyData}
            breakdown={weeklyBreakdown}
            percentChange={weekPercentChange}
            avgDaily={avgDailyHours}
            totalHours={totalWeekHours}
          />
          <Charts
            weeklyData={weeklyData}
            activityData={getActivityData()}
            contactHours={contactHours}
            consecutiveDays={consecutiveDays}
            timelineData={activities.filter((a) => a.date === targetDate)}
            flightHours={flightHours}
          />
        </>
      ) : (
        <ActivityTable
          activities={activities}
          handleEditActivity={handleEditActivity}
          deleteActivity={deleteActivity}
          handleShowNote={handleShowNote}
          formatLocalDate={formatLocalDate}
          formatTime24={formatTime24}
        />
      )}

      {!showCharts && !isHelpOpen && (
        <WarningSection
          flightHours={flightHours}
          contactHours={contactHours}
          consecutiveDays={consecutiveDays}
          dutyDay={dutyDay}
          past7DaysHours={past7DaysHours}
          restHours={restHours}
          formatHours={(h) => h.toFixed(1)}
          formatHoursSafe={(h) =>
            isNaN(Number(h)) ? "0.0" : Number(h).toFixed(2)
          }
          getBoxStyle={(type, value) => {
            let color = "grey";
            if (type === "flight" && value > 8) color = "#8B0000";
            else if (type === "flight" && value > 6) color = "#B8860B";
            if (type === "contact" && value >= 10) color = "#8B0000";
            else if (type === "contact" && value > 8) color = "#B8860B";
            if (type === "consecutive" && value > 15) color = "#8B0000";
            else if (type === "consecutive" && value === 15) color = "#B8860B";
            if (type === "duty" && value > 16) color = "#8B0000";
            else if (type === "duty" && value > 14) color = "#B8860B";
            if (type === "past7days" && value > 50) color = "#8B0000";
            else if (type === "past7days" && value >= 40) color = "#B8860B";
            if (type === "rest" && value > 0 && value < 10) color = "#8B0000";
            else if (type === "rest" && value === 0) color = "#B8860B";

            return {
              backgroundColor: color,
              color: "white",
              padding: "12px 16px",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: "bold",
              minWidth: "120px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            };
          }}
        />
      )}
    </div>
  );
}

export default App;
