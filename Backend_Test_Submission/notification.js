const priority = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

async function getTopNotifications() {
  try {
    const response = await fetch(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          "Authorization": " Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMzE1MDQwQG5lYy5lZHUuaW4iLCJleHAiOjE3ODI5Nzc0MDEsImlhdCI6MTc4Mjk3NjUwMSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjljZDI5OGNiLWY2MzAtNDNkMy1iZjdmLTMxNmVlOWQ2NGI5ZCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InNvbml5YSBsaW5nYW0gbSIsInN1YiI6ImE3ODRmZDJhLTNiMmQtNDc3Ny05NWYxLWIxYjNjYzI2YWQzNSJ9LCJlbWFpbCI6IjIzMTUwNDBAbmVjLmVkdS5pbiIsIm5hbWUiOiJzb25peWEgbGluZ2FtIG0iLCJyb2xsTm8iOiIyMzE1MDQwIiwiYWNjZXNzQ29kZSI6IkVSelV5eCIsImNsaWVudElEIjoiYTc4NGZkMmEtM2IyZC00Nzc3LTk1ZjEtYjFiM2NjMjZhZDM1IiwiY2xpZW50U2VjcmV0IjoiaEFQYUdxVmREZUdham5YcCJ9.V9hbGchdDW4f9eEBmFgvKSRjPJoqPHpl3jiUApS-O68",
        },
      }
    );

    const raw = await response.json();

    if (!response.ok) {
      console.log("API Error:", raw);
      return;
    }

    let notifications =
      raw?.data ||
      raw?.notifications ||
      raw ||
      [];

    if (!Array.isArray(notifications)) {
      console.log("Unexpected format:", raw);
      return;
    }

    notifications.sort((a, b) => {
      const p1 = priority[a.notificationType] || 0;
      const p2 = priority[b.notificationType] || 0;

      if (p1 !== p2) return p2 - p1;

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    console.log("Top 10 Notifications:");
    console.log(notifications.slice(0, 10));

  } catch (error) {
    console.error("Error:", error.message);
  }
}

getTopNotifications();