import React from "react";

const ActivityTable = ({
  activities,
  handleEditActivity,
  deleteActivity,
  handleShowNote,
  formatLocalDate,
  formatTime24,
}) => {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "99.9vw",
        margin: "0 auto",
        overflowX: "auto",
        boxSizing: "border-box",
        fontSize: "10px",
        display: "flex",
        paddingTop: "110px",
        paddingRight: "2vw",
        justifyContent: "center",
      }}
    >
      <table
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          width: "100%",
          maxWidth: "100%",
          borderCollapse: "collapse",
          fontSize: "10px",
          tableLayout: "fixed",
          minWidth: "100%",
        }}
      >
        <thead>
          <tr>
            <th style={{ minWidth: "65px" }}>Date</th>
            <th style={{ minWidth: "60px" }}>Start</th>
            <th style={{ minWidth: "60px" }}>End</th>
            <th style={{ minWidth: "45px" }}>Hrs</th>
            <th style={{ minWidth: "60px", textAlign: "left" }}>
              &nbsp;&nbsp;&nbsp;P/P
            </th>
            <th style={{ minWidth: "90px" }}>Activity</th>
            <th style={{ minWidth: "40px" }}>Note</th>
            <th style={{ minWidth: "40px" }}>Del</th>
          </tr>
        </thead>

        <tbody>
          {activities.map((activity, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#D3D3D3",
              }}
            >
              <td>{formatLocalDate(activity.date)}</td>

              <td>
                <input
                  type="time"
                  value={formatTime24(activity.start)}
                  onChange={(e) =>
                    handleEditActivity(index, "start", e.target.value)
                  }
                  style={{
                    width: "30px",
                    textAlign: "center",
                    fontSize: "12px",
                    padding: "0px",
                  }}
                />
              </td>

              <td>
                <input
                  type="time"
                  value={formatTime24(activity.end)}
                  onChange={(e) =>
                    handleEditActivity(index, "end", e.target.value)
                  }
                  style={{
                    width: "30px",
                    textAlign: "center",
                    fontSize: "12px",
                    padding: "0px",
                  }}
                />
              </td>

              <td style={{ textAlign: "center", color: "#007AFF" }}>
                {activity.duration}
              </td>

              <td>
                <input
                  type="tel" // iPhones now allow decimals
                  value={activity.prePost || "0"} // ✅ Use activity from the .map loop
                  onChange={(e) =>
                    handleEditActivity(index, "prePost", e.target.value)
                  }
                  step="0.1" // Allows decimal values like 0.5, 1.0, etc.
                  min="0" // Prevents negative numbers
                  inputMode="decimal" // Opens numeric keypad instead of full keyboard on mobile
                  pattern="[0-9]*" // Ensures only numbers are entered
                  style={{
                    width: "30px", // Set smaller width
                    color: "#007AFF",
                    fontSize: "12px",
                    padding: "2px", // Reduce padding
                    textAlign: "center",
                    appearance: "textfield", // Removes default browser styling
                  }}
                />
              </td>

              <td>
                <select
                  value={activity.activity}
                  onChange={(e) =>
                    handleEditActivity(index, "activity", e.target.value)
                  }
                  style={{ fontSize: "12px", padding: "1px" }}
                >
                  <option value="Flight">Flight</option>
                  <option value="SIM/ATD">SIM/ATD</option>
                  <option value="Ground">Ground</option>
                  <option value="Other Sched. Act.">Other Sched. Act.</option>
                </select>
              </td>

              <td
                onClick={() => handleShowNote(activity.note)}
                style={{ textAlign: "center", cursor: "pointer" }}
              >
                📎
              </td>

              <td style={{ textAlign: "center" }}>
                <button
                  onClick={() => deleteActivity(index)}
                  style={{
                    backgroundColor: "#8B0000",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  Del
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTable;
