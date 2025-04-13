import React, { useState } from "react";

let folderHandle = null;

const SaveAndLoad = ({ activities, setActivities, returnToMain }) => {
  const [csvData, setCsvData] = useState([]);

  const handleLocalSave = () => {
    if (activities.length === 0) {
      alert("No data available to save.");
      return;
    }
    localStorage.setItem("SafeHours", JSON.stringify(activities));
    alert("Data saved locally as 'SafeHours'.");
  };

  const handleLocalLoad = () => {
    const saved = localStorage.getItem("SafeHours");
    if (!saved) {
      alert("No local save data found.");
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) throw new Error();
      setActivities(parsed);
      returnToMain();
    } catch (err) {
      alert("Saved data is corrupted or invalid.");
    }
  };

  const handleExportToCSVLocalStorage = () => {
    if (activities.length === 0) {
      alert("No data available to export.");
      return;
    }
    const headers = ["Date", "Strt", "End", "Dur", "P/P", "Act", "Note"];
    const csvRows = activities.map((a) =>
      [
        formatDate(a.date),
        a.start,
        a.end,
        a.duration,
        a.prePost || "0",
        a.activity,
        a.note || "",
      ].join(",")
    );
    const csvContent = [headers.join(","), ...csvRows].join("\n");

    localStorage.setItem("SafeHoursExport.csv", csvContent);
    alert("Data exported as CSV to SafeHoursExport.csv.");
  };

  const handleViewExportedCSV = () => {
    const savedCSV = localStorage.getItem("SafeHoursExport.csv");
    if (!savedCSV) {
      alert("No exported CSV data found.");
      return;
    }

    const rows = savedCSV
      .trim()
      .split("\n")
      .map((row) => row.split(","));
    setCsvData(rows);

    const popupWindow = window.open(
      "",
      "CSV Viewer",
      "width=800,height=600,scrollbars=yes"
    );

    popupWindow.document.write(`
      <html>
        <head>
          <title>CSV Viewer</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 10px; font-size: 12px; }
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            th, td { padding: 6px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #f4f4f4; }
            td { word-wrap: break-word; }
            .scrollable { max-height: 300px; overflow-y: scroll; }
          </style>
        </head>
        <body>
          <h2>Exported CSV Data</h2>
          <div class="scrollable">
            <table>
              <thead>
                <tr>
                  ${rows[0].map((header) => `<th>${header}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${rows
                  .slice(1)
                  .map(
                    (row) =>
                      `<tr>${row
                        .map((cell, index) =>
                          index === 0
                            ? `<td>${formatDate(cell)}</td>`
                            : `<td>${cell}</td>`
                        )
                        .join("")}</tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          <!-- ✅ Return Button -->
          <div style="text-align:center; margin-top: 20px;">
            <button onclick="window.close()" style="
              background-color: white;
              color: black;
              border: 2px solid black;
              padding: 10px 20px;
              border-radius: 10px;
              font-weight: bold;
              font-size: 14px;
              cursor: pointer;
            ">
              Main Screen
            </button>
          </div>

        </body>
      </html>
    `);

    popupWindow.document.close();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "2-digit" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: "20px", fontSize: "18px" }}>
        Save & Load Options
      </h2>

      <div style={buttonRowStyle}>
        <button
          onClick={handleLocalSave}
          style={{ ...buttonStyle, backgroundColor: "green", color: "white" }}
        >
          Save to Local Storage
        </button>
        <button
          onClick={handleLocalLoad}
          style={{ ...buttonStyle, backgroundColor: "gray", color: "white" }}
        >
          Load from Local Storage
        </button>
      </div>

      <div style={buttonRowStyle}>
        <button onClick={handleExportToCSVLocalStorage} style={buttonStyle}>
          Export to LocalStorage (CSV)
        </button>
        <button onClick={handleViewExportedCSV} style={buttonStyle}>
          View Exported CSV from LocalStorage
        </button>
      </div>

      <div style={buttonRowStyle}>
        <button onClick={returnToMain} style={buttonStyle}>
          Main Screen
        </button>
      </div>

      {csvData.length > 0 && (
        <div
          style={{
            marginTop: "10px",
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "10px",
            maxWidth: "100%",
            overflowX: "auto",
          }}
        >
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                {csvData[0].map((header, idx) => (
                  <th key={idx} style={tableCellStyle}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} style={tableCellStyle}>
                      {colIndex === 0 ? formatDate(cell) : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
};

const buttonStyle = {
  width: "180px",
  height: "35px",
  margin: "6px",
  fontSize: "12px",
  fontWeight: "bold",
  borderRadius: "8px",
  border: "2px solid black",
  cursor: "pointer",
  backgroundColor: "white",
  color: "black",
};

const buttonRowStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "8px",
};

const tableCellStyle = {
  border: "1px solid #ccc",
  padding: "4px",
  textAlign: "left",
  fontSize: "8px",
};

export default SaveAndLoad;
