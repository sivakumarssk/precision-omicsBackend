import React, { useState } from 'react';
import axios from 'axios';
import './EventDetails.css';

const EventDetails = ({ event, onClose, onDeleteImage }) => {
    const [error, setError] = useState('');

    // Delete an image from the event
    const deleteImage = async (imagePath) => {
        try {
            const response = await axios.delete('https://your-api.com/api/past-events/image', {
                data: { eventDate: event.eventDate, imagePath },
            });
            onDeleteImage(response.data.pastEvent.eventImages);
            alert('Image deleted successfully.');
        } catch (error) {
            console.error('Error deleting image:', error);
            setError('Failed to delete image.');
        }
    };

    return (
        <div className="event-details-modal">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>
                    Close
                </button>
                <h2>Event Details</h2>
                <p>
                    <strong>Date:</strong> {event.eventDate}
                </p>
                <p>
                    <strong>PDF:</strong>{' '}
                    {event.eventPdf ? (
                        <a href={`https://your-api.com${event.eventPdf}`} target="_blank" rel="noopener noreferrer">
                            View PDF
                        </a>
                    ) : (
                        'No PDF available'
                    )}
                </p>

                <h3>Images</h3>
                {event.eventImages && event.eventImages.length > 0 ? (
                    <div className="images-container">
                        {event.eventImages.map((image, index) => (
                            <div key={index} className="image-item">
                                <img
                                    src={`https://your-api.com${image}`}
                                    alt={`Event ${event.eventDate} Image ${index + 1}`}
                                />
                                <button onClick={() => deleteImage(image)}>Delete</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No images available.</p>
                )}

                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default EventDetails;
