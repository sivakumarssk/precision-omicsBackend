// File: src/components/PastEventsList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import ImageManagerModal from "./ImageManagerModal.jsx";
import './PastEventsList.css'

const PastEventsList = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("https://admin.precision-omics.org/api/past-events");
      setEvents(response.data);
    } catch (error) {
      alert("Error fetching events.");
    }
  };

  const handleDeleteEvent = async (eventDate) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`https://admin.precision-omics.org/api/past-events/${eventDate}`);
      alert("Event deleted successfully.");
      fetchEvents();
    } catch (error) {
      alert("Error deleting the event.");
    }
  };

  const handleViewPdf = (pdfPath) => {
    if (pdfPath) {
      window.open(`https://admin.precision-omics.org${pdfPath}`, "_blank");
    } else {
      alert("No PDF available for this event.");
    }
  };

  return (
    <div className="pastEventCon">
      <h2>Past Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.eventDate}>
            <span>{event.eventDate}</span>
            <button onClick={() => setSelectedEvent(event)}>View Images</button>
            <button onClick={() => handleViewPdf(event.eventPdf)}>View PDF</button>
            <button onClick={() => handleDeleteEvent(event.eventDate)}>Delete</button>
          </li>
        ))}
      </ul>
      {selectedEvent && (
        <ImageManagerModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onImagesUpdated={fetchEvents}
        />
      )}
    </div>
  );
};

export default PastEventsList;
