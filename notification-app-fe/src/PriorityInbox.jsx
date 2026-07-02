import React, { useEffect, useState } from "react";

function PriorityInbox() {
  const [topNotifications, setTopNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const TOKEN =
    import.meta.env.VITE_API_TOKEN ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMzE1MDQwQG5lYy5lZHUuaW4iLCJleHAiOjE3ODI5Nzc0MDEsImlhdCI6MTc4Mjk3NjUwMSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjljZDI5OGNiLWY2MzAtNDNkMy1iZjdmLTMxNmVlOWQ2NGI5ZCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InNvbml5YSBsaW5nYW0gbSIsInN1YiI6ImE3ODRmZDJhLTNiMmQtNDc3Ny05NWYxLWIxYjNjYzI2YWQzNSJ9LCJlbWFpbCI6IjIzMTUwNDBAbmVjLmVkdS5pbiIsIm5hbWUiOiJzb25peWEgbGluZ2FtIG0iLCJyb2xsTm8iOiIyMzE1MDQwIiwiYWNjZXNzQ29kZSI6IkVSelV5eCIsImNsaWVudElEIjoiYTc4NGZkMmEtM2IyZC00Nzc3LTk1ZjEtYjFiM2NjMjZhZDM1IiwiY2xpZW50U2VjcmV0IjoiaEFQYUdxVmREZUdham5YcCJ9.V9hbGchdDW4f9eEBmFgvKSRjPJoqPHpl3jiUApS-O68";
    const priority = {
    Placement: 3,
    Result: 2,
    Event: 1,
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://4.224.186.213/evaluation-service/notifications",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Status:", response.status);

      const data = await response.json();

      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const notifications = data.notifications || [];

      const sortedNotifications = [...notifications].sort((a, b) => {
        if (priority[b.Type] !== priority[a.Type]) {
          return priority[b.Type] - priority[a.Type];
        }

        return new Date(b.Timestamp) - new Date(a.Timestamp);
      });

      setTopNotifications(sortedNotifications.slice(0, 10));
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Top 10 Priority Notifications</h2>

      {loading && <p>Loading notifications...</p>}

      {error && (
        <p style={{ color: "red" }}>
          Error: {error}
        </p>
      )}

      {!loading && (
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>S.No</th>
              <th>Type</th>
              <th>Message</th>
              <th>Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {topNotifications.length > 0 ? (
              topNotifications.map((notification, index) => (
                <tr key={notification.ID}>
                  <td>{index + 1}</td>
                  <td>{notification.Type}</td>
                  <td>{notification.Message}</td>
                  <td>{notification.Timestamp}</td>
                </tr>
              ))
            ) : (
              !error && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No notifications found.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PriorityInbox;