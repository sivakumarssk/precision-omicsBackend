const PastEvent = require('../models/pastEvent');
const { uploadFile, deleteFile } = require('../middlewares/filehandle');

// Add or update a past event (date and PDF)
exports.addOrUpdateEvent = async (req, res) => {
    const { eventDate } = req.body;
    const file = req.files?.eventPdf;

    if (!eventDate) {
        return res.status(400).json({ error: "Event date is required." });
    }

    try {
        let pastEvent = await PastEvent.findOne({ eventDate });

        if (!pastEvent) {
            pastEvent = new PastEvent({ eventDate });
        }

        if (file) {
            // Upload the new PDF
            const pdfPath = await uploadFile(file, 'eventPdfs');
            if (!pdfPath) {
                return res.status(500).json({ error: "Error uploading PDF." });
            }

            // Delete old PDF if exists
            if (pastEvent.eventPdf) {
                await deleteFile(pastEvent.eventPdf);
            }

            pastEvent.eventPdf = pdfPath;
        }

        await pastEvent.save();

        res.status(200).json({ message: "Event added/updated successfully.", pastEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error adding/updating the event." });
    }
};

// Add an image to a past event
exports.addEventImage = async (req, res) => {
    const { eventDate } = req.body;
    const file = req.files?.eventImage;

    if (!eventDate || !file) {
        return res.status(400).json({ error: "Event date and image are required." });
    }

    try {
        const pastEvent = await PastEvent.findOne({ eventDate });
        if (!pastEvent) {
            return res.status(404).json({ error: "Event not found." });
        }

        // Upload the image
        const imagePath = await uploadFile(file, 'eventImages');
        if (!imagePath) {
            return res.status(500).json({ error: "Error uploading image." });
        }

        // Add the image path to the array
        pastEvent.eventImages.push(imagePath);

        await pastEvent.save();

        res.status(200).json({ message: "Image added successfully.", pastEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error adding the image." });
    }
};

// Delete an image from a past event
exports.deleteEventImage = async (req, res) => {
    const { eventDate, imagePath } = req.body;

    if (!eventDate || !imagePath) {
        return res.status(400).json({ error: "Event date and image path are required." });
    }

    try {
        const pastEvent = await PastEvent.findOne({ eventDate });
        if (!pastEvent) {
            return res.status(404).json({ error: "Event not found." });
        }

        // Remove the image path from the array
        const imageIndex = pastEvent.eventImages.indexOf(imagePath);
        if (imageIndex === -1) {
            return res.status(404).json({ error: "Image not found in the event." });
        }

        pastEvent.eventImages.splice(imageIndex, 1);
        await pastEvent.save();

        // Delete the image file
        await deleteFile(imagePath);

        res.status(200).json({ message: "Image deleted successfully.", pastEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting the image." });
    }
};

// Delete a past event
exports.deletePastEvent = async (req, res) => {
    const { eventDate } = req.params;

    if (!eventDate) {
        return res.status(400).json({ error: "Event date is required." });
    }

    try {
        const pastEvent = await PastEvent.findOne({ eventDate });
        if (!pastEvent) {
            return res.status(404).json({ error: "Event not found." });
        }

        // Delete all associated files
        for (const image of pastEvent.eventImages) {
            await deleteFile(image);
        }
        if (pastEvent.eventPdf) {
            await deleteFile(pastEvent.eventPdf);
        }

        // Delete the document
        await PastEvent.deleteOne({ eventDate });

        res.status(200).json({ message: "Event deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting the event." });
    }
};

// Get all past events
exports.getAllPastEvents = async (req, res) => {
    try {
        const pastEvents = await PastEvent.find();
        res.status(200).json(pastEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error retrieving past events." });
    }
};

// Get details of a specific past event
exports.getPastEventDetails = async (req, res) => {
    const { eventDate } = req.params;

    if (!eventDate) {
        return res.status(400).json({ error: "Event date is required." });
    }

    try {
        const pastEvent = await PastEvent.findOne({ eventDate });
        if (!pastEvent) {
            return res.status(404).json({ error: "Event not found." });
        }

        res.status(200).json(pastEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error retrieving the event details." });
    }
};

  // Endpoint to fetch menu structure dynamically
  exports.getDynamicMenu = async (req, res) => {
    try {
      const pastEvents = await PastEvent.find({}, "eventDate");
      const dynamicMenus = pastEvents.map((event) => ({
        label: event.eventDate,
        link: `/past-events/${event.eventDate}`,
        submenu: [
          { label: "Gallery", link: `/pastevents/gallery?date=${event.eventDate}` },
          { label: "Agenda", link: `/pastevents/agenda/?date=${event.eventDate}` },
        ],
      }));
  
      res.status(200).json({ menus: dynamicMenus });
    } catch (error) {
      console.error("Error fetching dynamic menu:", error);
      res.status(500).json({ error: "Error retrieving dynamic menu." });
    }
  };

  // Get details of a specific past event along with up to 8 images
  exports.getLastEventWithImages = async (req, res) => {
    try {
        // Find the most recent event by sorting by eventDate in descending order
        const pastEvent = await PastEvent.findOne().sort({ eventDate: -1 });

        if (!pastEvent) {
            return res.status(404).json({ error: "No events found." });
        }

        // Limit the images to 8
        const limitedImages = pastEvent.eventImages.slice(0, 8);

        // Response object with all event data and up to 8 images
        const response = {
            ...pastEvent._doc, // Spread all event data
            eventImages: limitedImages, // Limit images to 8
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching the most recent event with images:", error);
        res.status(500).json({ error: "Error retrieving the most recent event details." });
    }
};

