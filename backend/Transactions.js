import express from 'express';
import Notification from './models/Notification.js';
import Transaction from './models/Transaction.js';
import User from './models/Usermodel.js'; // Added User model import

const router = express.Router();
const messages = [];


// **Save Transaction Details**
router.post("/transactions", async (req, res) => {
  try {
    const { 
      userId, 
      type, 
      amount, 
      category, 
      description, 
      bank, 
      account, 
      recipient, 
      extractionConfidence, 
      rawMessage 
    } = req.body;

    if (!userId || !type || !amount) {
      return res.status(400).json({ message: "Missing required transaction details" });
    }

    const transaction = await Transaction.create({
      userId,
      type,
      amount,
      category,
      description,
      bank,
      account,
      recipient,
      extractionConfidence,
      rawMessage
    });

    res.status(201).json({ 
      message: "Transaction saved successfully", 
      transaction 
    });
  } catch (error) {
    console.error(" Error saving transaction:", error);
    res.status(500).json({ message: "Error saving transaction", error: error.message });
  }
});

// **Get User Transactions**
router.get("/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(transactions);
  } catch (error) {
    console.error(" Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions", error: error.message });
  }
});

// **SMS Routes**
router.post("/api/sms", async (req, res) => {
  try {
    console.log('Received SMS payload:', req.body);
    
    const { 
      email, 
      message, 
      sender, 
      timestamp, 
      location 
    } = req.body;

    // Validate required fields
    if (!email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prepare notification object
    const notification = {
      sender: sender || 'Unknown',
      message: message,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      location: location 
        ? {
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy
          }
        : null
    };

    // Add notification to user's notifications
    user.notifications.push(notification);

    // Save the updated user document
    await user.save();

    res.status(200).json({ 
      message: "SMS received and saved successfully",
      notificationId: user.notifications[user.notifications.length - 1]._id
    });
  } catch (error) {
    console.error('Error processing SMS:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/sms", (req, res) => {
  res.json(messages);
});

export default router;