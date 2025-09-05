import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";

const badgeColors = [
  "badge-primary",
  "badge-secondary",
  "badge-accent",
  "badge-info",
  "badge-success",
  "badge-warning",
  "badge-error"
];

const getRandomBadgeColor = () => {
  const randomIndex = Math.floor(Math.random() * badgeColors.length);
  return badgeColors[randomIndex];
};

function Calendar({ googleAccessToken, onUpdateEvents }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]); // local state for display

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      if (!user || !googleAccessToken) {
        setLoading(false);
        onUpdateEvents([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const now = new Date();
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(now.getDate() + 7);

        const response = await axios.get(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            headers: {
              Authorization: `Bearer ${googleAccessToken}`,
            },
            params: {
              timeMin: now.toISOString(),
              timeMax: oneWeekFromNow.toISOString(),
              singleEvents: true,
              orderBy: "startTime",
            },
          }
        );

        onUpdateEvents(response.data.items);
        setEvents(response.data.items); // Update local state for display

      } catch (err) {
        console.error("Failed to fetch calendar events:", err);
        setError("Failed to load calendar events. Please try again.");
        onUpdateEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendarEvents();
  }, [user, googleAccessToken, onUpdateEvents]);

  if (!user) {
    return (
      <div className="card bg-base-100 shadow-md flex-1">
        <div className="card-body">
          <h2 className="card-title">Calendar</h2>
          <p>
            Please sign in with your Google account to connect your calendar.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-md flex-1">
        <div className="card-body">
          <span className="loading loading-spinner"></span>
          <p>Loading calendar events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow-md flex-1">
        <div className="card-body text-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

   return (
    <li className="list-row">
      <div>
        <img
          className="size-10 rounded-box"
          src="/icons/calendar-solid-full.svg"
        />
      </div>
      <div>
        <h2 className="card-title">Upcoming Events</h2>
        {events.length > 0 ? (
          <ul>
            {events.map((event) => (
              <li key={event.id} className="mb-2">
                <p className="font-semibold">{event.summary}</p>
                <p className="text-sm text-gray-500">
                  {new Date(
                    event.start.dateTime || event.start.date
                  ).toLocaleString()}
                </p>
                {event.description && (
                  <div className="text-xs mt-1 text-gray-400">
                    {/* Split the description by spaces and map each word to a p tag */}
                    {event.description.split(",").map((word, index) => (
                      <div key={index} className={`badge badge-soft ${getRandomBadgeColor()} mr-1`}>
                        {word}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming events found.</p>
        )}
      </div>
    </li>
  );
}

export default Calendar;