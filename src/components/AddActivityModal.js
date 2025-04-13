import React, { useEffect } from "react";

const AddActivityModal = ({
  newActivity,
  setNewActivity,
  addActivity,
  setIsModalOpen,
}) => {
  // Set default time/date on mount if not already set
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const today = now.toISOString().split("T")[0];

    if (!newActivity.start || !newActivity.date) {
      setNewActivity((prev) => ({
        ...prev,
        start: `${hours}:${minutes}`,
        date: today,
      }));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setNewActivity({ ...newActivity, [field]: value });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        zIndex: 1000,
        maxWidth: "600px",
        width: "90%",
      }}
    >
      <h3 style={{ textAlign: "center", fontSize: "26px" }}>
        Add New Activity
      </h3>

      {/* 📆 Date */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label>Date</label>
        <br />
        <input
          type="date"
          value={newActivity.date}
          onChange={(e) => handleInputChange("date", e.target.value)}
          style={{
            fontSize: "22px",
            padding: "10px",
            width: "60%",
            textAlign: "center",
            border: "2px solid black",
            borderRadius: "10px",
            marginTop: "5px",
          }}
        />
      </div>

      {/* ⏰ Time + Duration + PrePost */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "14px",
          marginBottom: "15px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <label>Start</label>
          <br />
          <input
            type="time"
            value={newActivity.start}
            onChange={(e) => handleInputChange("start", e.target.value)}
            style={{
              fontSize: "18px",
              width: "90px",
              padding: "6px",
              textAlign: "center",
            }}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <label>Duration</label>
          <br />
          <input
            type="number"
            step="0.1"
            min="0"
            max="23.9"
            value={newActivity.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
            style={{
              fontSize: "18px",
              width: "90px",
              padding: "6px",
              textAlign: "center",
            }}
          />
        </div>
        {(newActivity.activity === "Flight" ||
          newActivity.activity === "SIM/ATD") && (
          <div style={{ textAlign: "center" }}>
            <label>Pre/Post</label>
            <br />
            <input
              type="number"
              step="0.1"
              min="0"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              value={newActivity.prePost || "0"}
              onChange={(e) => handleInputChange("prePost", e.target.value)}
              style={{
                fontSize: "18px",
                width: "90px",
                padding: "6px",
                textAlign: "center",
              }}
            />
          </div>
        )}
      </div>

      {/* 📝 Note */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <label>Note</label>
        <br />
        <textarea
          value={newActivity.note}
          onChange={(e) => handleInputChange("note", e.target.value)}
          style={{
            width: "80%",
            height: "60px",
            fontSize: "14px",
            padding: "6px",
            marginTop: "6px",
            borderRadius: "6px",
          }}
        />
      </div>

      {/* 🎛 Activity Selector */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label>Activity</label>
        <br />
        <select
          value={newActivity.activity}
          onChange={(e) => handleInputChange("activity", e.target.value)}
          style={{
            fontSize: "18px",
            padding: "8px",
            width: "200px",
            textAlign: "center",
            marginTop: "6px",
          }}
        >
          <option value="Flight">Flight</option>
          <option value="SIM/ATD">SIM/ATD</option>
          <option value="Ground">Ground</option>
          <option value="Other Sched. Act.">Other Sched. Act.</option>
        </select>
      </div>

      {/* 🔘 Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <button
          onClick={() => setIsModalOpen(false)}
          style={{
            backgroundColor: "#8B0000",
            color: "white",
            padding: "10px 20px",
            border: "2px solid black",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          Close
        </button>
        <button
          onClick={addActivity}
          style={{
            backgroundColor: "#006400", // Hunter green
            color: "white",
            padding: "10px 20px",
            border: "2px solid black",
            borderRadius: "10px",
            fontWeight: "bold",
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddActivityModal;
