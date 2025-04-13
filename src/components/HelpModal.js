import React from "react";

const HelpModal = ({ setIsHelpOpen }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px 30px",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        zIndex: 1000,
        maxWidth: "700px",
        width: "90%",
        maxHeight: "90vh",
        overflowY: "auto", // ✅ Scrollable!
      }}
    >
      <h3
        style={{ textAlign: "center", fontSize: "26px", marginBottom: "10px" }}
      >
        Overview
      </h3>

      <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
        <p>
          <strong>SafeHours – Flight & Duty Tracking for CFIs</strong>
        </p>
        <p>
          <strong>SafeHours</strong> is a tracking tool designed for{" "}
          <strong>Certified Flight Instructors (CFIs)</strong> to efficiently
          monitor their work hours and ensure compliance with{" "}
          <strong>FAA regulations and SP&P policies</strong>.
        </p>

        <ul style={{ paddingLeft: "20px" }}>
          <li>
            <strong>Log Activities</strong> – Track flight instruction,
            simulator (SIM/ATD) sessions, ground instruction, and other
            scheduled activities.
          </li>
          <li>
            <strong>Automated Calculations</strong> – Computes daily, weekly,
            and consecutive duty hours.
          </li>
          <li>
            <strong>Regulatory Compliance</strong> – Helps CFIs stay within FAA
            and SP&P limits for:
            <ul style={{ paddingLeft: "20px" }}>
              <li>Flight hours (Max per 24 hours)</li>
              <li>Contact time (Total instructional time per day)</li>
              <li>Duty periods (Max consecutive hours worked)</li>
              <li>Required rest (Ensures minimum break time)</li>
            </ul>
          </li>
          <li>
            <strong>Visual Tracking</strong> – Generates charts to display
            flight and duty hour trends.
          </li>
          <li>
            <strong>Warning Alerts</strong> – Notifies CFIs when approaching or
            exceeding regulatory limits.
          </li>
          <li>
            <strong>Local Data Storage</strong> – Saves records directly on the
            device for easy access.
          </li>
        </ul>

        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#FFF3CD",
            color: "#856404",
            border: "1px solid #FFD700",
            borderRadius: "8px",
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          ⚠️ <strong>Disclaimer:</strong> SafeHours is an informational tool
          only. Users are responsible for ensuring compliance with FAA
          regulations and official record-keeping requirements.
        </div>
      </div>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <button
          onClick={() => setIsHelpOpen(false)}
          style={{
            backgroundColor: "#8B0000",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
            fontSize: "14px",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default HelpModal;
