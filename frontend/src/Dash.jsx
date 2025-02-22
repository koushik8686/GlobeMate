import { useEffect, useState } from "react";
import axios from "axios";
import Places from "./Places";

function App() {
  const [events, setEvents] = useState([]);

  const fetchCalendarEvents = async () => {
    try {
      const res = await axios.get("http://localhost:4000/calendar/events", { withCredentials: true });
      setEvents(res.data);
    } catch (error) {
      console.error("❌ Error fetching events:", error);
    }
  };

  return (
    <div>
      <h1>Google Calendar Events</h1>
      <a href="http://localhost:4000/auth/google">
        <button>Login with Google</button>
      </a>
      <button onClick={fetchCalendarEvents}>Fetch Events</button>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <strong>{event.summary}</strong> <br />
            📅 {new Date(event.start.dateTime || event.start.date).toLocaleString()} -{" "}
            {new Date(event.end.dateTime || event.end.date).toLocaleString()} <br />
            📍 {event.location || "No Location"}
          </li>
        ))}
      </ul>
      
      <Places />
    </div>
  );
}

export default App;
