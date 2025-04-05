// File: src/components/PastEvents.js
import React, { useState } from "react";
import axios from "axios";
import './PastEventsList.css'

const PastEvents = () => {
  const [eventDate, setEventDate] = useState("");
  const [eventPdf, setEventPdf] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("eventDate", eventDate);
    if (eventPdf) formData.append("eventPdf", eventPdf);

    try {
      const response = await axios.post("https://admin.precision-omics.org/api/past-events/date-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message);
    } catch (error) {
        console.log(error,'error');
      alert("Error adding/updating the event.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pastEventCon">
      <div>
        <label>Event Date:</label>
        <input
          type="text"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />
      </div>
      <br/>
      <div>
        <label>Upload PDF:</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setEventPdf(e.target.files[0])}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default PastEvents;
