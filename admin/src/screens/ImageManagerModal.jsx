// File: src/components/ImageManagerModal.js
import React, { useState } from "react";
import axios from "axios";

const ImageManagerModal = ({ event, onClose, onImagesUpdated }) => {
  const [newImage, setNewImage] = useState(null);

  const handleAddImage = async () => {
    const formData = new FormData();
    formData.append("eventDate", event.eventDate);
    if (newImage) formData.append("eventImage", newImage);

    try {
      const response = await axios.post("https://admin.precision-omics.org/api/past-events/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message);
      onImagesUpdated();
    } catch (error) {
      alert("Error uploading image.");
    }
  };

  const handleDeleteImage = async (imagePath) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await axios.delete("https://admin.precision-omics.org/api/past-events/image", {
        data: { eventDate: event.eventDate, imagePath },
      });
      alert("Image deleted successfully.");
      onImagesUpdated();
    } catch (error) {
      alert("Error deleting the image.");
    }
  };

  return (
    <div className="modal">
      <h3>Manage Images for {event.eventDate}</h3>
      <ul>
        {(event.eventImages || []).length > 0 ? (
          event.eventImages.map((imagePath, index) => (
            <li key={index}>
              <img src={`https://admin.precision-omics.org${imagePath}`} alt={`Event ${index}`} width={100} />
              <button onClick={() => handleDeleteImage(imagePath)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No images available for this event.</p>
        )}
      </ul>
      <div>
        <label>Add New Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files[0])}
        />
        <button onClick={handleAddImage}>Upload</button>
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ImageManagerModal;
