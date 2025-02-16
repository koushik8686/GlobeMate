import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { google } from "googleapis";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./auth.js";
import TransactionRoutes from "./Transactions.js";
import User from "./models/Usermodel.js";
import Notification from "./models/Notification.js";
import Transaction from "./models/Transaction.js";
import Event from "./models/CalenderEvents.js";
dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev")); // Logs requests

// Mount authentication routes
app.use('/auth', authRoutes);
app.use('/', TransactionRoutes);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// Google OAuth Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const messages = [];

// Existing routes
app.get("/auth/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.readonly", "email", "profile"],
  });
  console.log("🔗 Redirecting user to Google OAuth...");
  res.redirect(authUrl);
});

app.get("/auth/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // **Get User Details**
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    console.log("✅ User authenticated:", data);

    // **Store User in MongoDB**
    let user = await User.findOne({ googleId: data.id });
    if (!user) {
      user = new User({
        googleId: data.id,
        email: data.email,
        name: data.name,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });
      await user.save();
      console.log("✅ New user saved to MongoDB:", user);
    } else {
      console.log("🔄 User already exists in DB:", user);
    }

    res.cookie("auth_token", tokens.access_token, { httpOnly: true });
    res.redirect("http://localhost:3000/dashboard");
  } catch (error) {
    console.error("❌ Error in Google OAuth callback:", error);
    res.status(500).json({ message: "Authentication Failed", error });
  }
});

// **Fetch User's Google Calendar Events & Store in MongoDB**
app.get("/calendar/events", async (req, res) => {
  try {
    const accessToken = req.cookies.auth_token;
    if (!accessToken) return res.status(401).json({ message: "Unauthorized" });

    oauth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // **Fetch events**
    const eventsResponse = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = eventsResponse.data.items;
    console.log("📅 Fetched Events from Google Calendar:", events);

    // **Store Events in MongoDB**
    for (const event of events) {
      const existingEvent = await Event.findOne({ eventId: event.id });
      if (!existingEvent) {
        const newEvent = new Event({
          googleId: event.creator.email,
          eventId: event.id,
          summary: event.summary || "No Title",
          description: event.description || "No Description",
          location: event.location || "No Location",
          startTime: event.start.dateTime || event.start.date,
          endTime: event.end.dateTime || event.end.date,
        });

        await newEvent.save();
        console.log("✅ Event saved to MongoDB:", newEvent);
      } else {
        console.log("🔄 Event already exists in DB:", existingEvent);
      }
    }

    res.json(events);
  } catch (err) {
    console.error("❌ Error fetching events:", err);
    res.status(500).json({ message: "Error fetching events", error: err });
  }
});


app.listen(4000, () => console.log("✅ Server running on http://localhost:4000"));
