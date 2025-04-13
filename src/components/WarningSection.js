import React from "react";

const WarningSection = ({
  flightHours,
  contactHours,
  consecutiveDays,
  dutyDay,
  past7DaysHours,
  restHours,
  formatHours,
  formatHoursSafe,
  getBoxStyle,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#D2B48C",
        padding: "1px 0",
        zIndex: 1000,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Row 1 */}
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button
          style={getBoxStyle("flight", flightHours)}
          onClick={() =>
            alert(`✈️ 14 CFR § 61.195(j): 
Flight instructor may not conduct more than 8 hours of flight training in any 24-hour period.`)
          }
        >
          Flight Instruction
          <div>{formatHours(flightHours)} hrs</div>
        </button>

        <button
          style={getBoxStyle("contact", contactHours)}
          onClick={() =>
            alert(`📚 SP&P 2.10.7(B): 
No more than 10 contact hours in any 24-hour period.`)
          }
        >
          Contact Time
          <div>{formatHours(contactHours)} hrs</div>
        </button>

        <button
          style={getBoxStyle("consecutive", consecutiveDays)}
          onClick={() =>
            alert(`📅 SP&P 2.10.8:
No instructor shall work more than 15 consecutive days without 1 day off.`)
          }
        >
          Consecutive Days
          <div>
            {Math.floor(consecutiveDays) === 1
              ? "1 day"
              : `${Math.floor(consecutiveDays)} days`}
          </div>
        </button>
      </div>

      {/* Row 2 */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "10px",
          justifyContent: "center",
        }}
      >
        <button
          style={getBoxStyle("duty", dutyDay)}
          onClick={() =>
            window.confirm(`🕐 SP&P 2.10.6:
Each duty period must not exceed 16 hours and must be preceded by 10 hrs rest.`)
          }
        >
          Duty Period
          <div>{formatHours(dutyDay)} hrs</div>
        </button>

        <button
          style={getBoxStyle("past7days", past7DaysHours)}
          onClick={() =>
            alert(`🗓️ SP&P 2.10.7(C):
No more than 50 contact hours in any 7 consecutive days.`)
          }
        >
          Past 7 Days
          <div>{formatHours(past7DaysHours)} hrs</div>
        </button>

        <button
          style={getBoxStyle("rest", restHours)}
          onClick={() =>
            alert(`🛌 SP&P 2.10.3:
Minimum 10 hours uninterrupted rest before next duty period.`)
          }
        >
          Rest Period
          <div>
            {restHours === 0
              ? "Need Prev Activ."
              : `${formatHoursSafe(restHours)} hrs`}
          </div>
        </button>
      </div>
    </div>
  );
};

export default WarningSection;
