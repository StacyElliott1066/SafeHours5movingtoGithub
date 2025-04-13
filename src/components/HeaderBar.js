import React from "react";

const HeaderBar = ({
  targetDate,
  setTargetDate,
  setIsModalOpen,
  setShowCharts,
  showCharts,
  setIsHelpOpen,
  setShowSaveScreen,
}) => {
  const headerButtonStyle = {
    backgroundColor: "#f0f0f0",
    color: "black",
    fontWeight: "bold",
    fontSize: "24px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    transition: "box-shadow 0.2s ease, transform 0.2s ease",
  };

  const handleHover = (e, up) => {
    e.currentTarget.style.boxShadow = up
      ? "0 6px 12px rgba(0, 0, 0, 0.35)"
      : "0 4px 8px rgba(0, 0, 0, 0.3)";
    e.currentTarget.style.transform = up ? "translateY(-2px)" : "translateY(0)";
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        backgroundColor: "tan",
        padding: "3px",
        zIndex: "1000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
      }}
    >
      <h1 style={{ margin: "0", fontSize: "24px" }}>
        SafeHours Version 4.10.17:35
      </h1>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {/* ➕ */}
        <div
          style={headerButtonStyle}
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          +
        </div>

        {/* 📊 */}
        <div
          style={headerButtonStyle}
          onClick={() => setShowCharts(!showCharts)}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          📊
        </div>

        {/* 📅 */}
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          style={{
            fontSize: "22px",
            padding: "10px",
            width: "120px",
            borderRadius: "6px",
            backgroundColor: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          }}
        />

        {/* ❓ */}
        <div
          style={headerButtonStyle}
          onClick={() => setIsHelpOpen(true)}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          ?
        </div>

        {/* 💾 */}
        <div
          style={headerButtonStyle}
          onClick={() => setShowSaveScreen(true)}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          💾
        </div>
      </div>

      <div style={{ marginTop: "5px", fontWeight: "bold", fontSize: "20px" }}>
        Target Date
      </div>
    </div>
  );
};

export default HeaderBar;
