import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(err => console.log(err));

// 🔥 Schemas
const reportSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  location: String,
  severity: Number,
  peopleAffected: Number,
  timeDelay: Number,
  urgencyScore: Number,
  urgencyLevel: String,
  status: { type: String, default: "Pending" },
  assignedVolunteerId: String,
  createdAt: { type: Date, default: Date.now }
});

const volunteerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  location: String,
  skills: [String],
  points: { type: Number, default: 0 }
});

const Report = mongoose.model("Report", reportSchema);
const Volunteer = mongoose.model("Volunteer", volunteerSchema);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 🔹 Submit Report
  app.post('/api/reports', async (req, res) => {
    try {
      const { title, description, type, location, severity, peopleAffected, timeDelay } = req.body;

      const urgencyScore = (severity * 0.5) + (peopleAffected * 0.3) + (timeDelay * 0.2);
      let urgencyLevel = 'Low';
      if (urgencyScore > 7) urgencyLevel = 'Critical';
      else if (urgencyScore >= 4) urgencyLevel = 'Medium';

      const report = await Report.create({
        title,
        description,
        type,
        location,
        severity,
        peopleAffected,
        timeDelay,
        urgencyScore,
        urgencyLevel
      });

      res.status(201).json(report);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // 🔹 Get Reports
  app.get('/api/reports', async (req, res) => {
    const reports = await Report.find();
    res.json(reports);
  });

  // 🔹 Signup
  app.post('/api/volunteers/signup', async (req, res) => {
    const { name, email, password, location, skills } = req.body;

    const existing = await Volunteer.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email exists" });

    const volunteer = await Volunteer.create({
      name, email, password, location, skills
    });

    res.json(volunteer);
  });

  // 🔹 Login
  app.post('/api/volunteers/login', async (req, res) => {
    const { email, password } = req.body;

    const volunteer = await Volunteer.findOne({ email, password });
    if (!volunteer) return res.status(401).json({ error: "Invalid credentials" });

    res.json(volunteer);
  });

  // 🔹 Matching Tasks
  app.get('/api/volunteers/:id/matching-tasks', async (req, res) => {
    const { id } = req.params;

    const volunteer = await Volunteer.findById(id);
    if (!volunteer) return res.status(404).json({ error: "Not found" });

    const tasks = await Report.find({
      status: "Pending",
      location: volunteer.location,
      type: { $in: volunteer.skills }
    });

    res.json(tasks);
  });

  // 🔹 My Tasks
  app.get('/api/volunteers/:id/my-tasks', async (req, res) => {
    const tasks = await Report.find({ assignedVolunteerId: req.params.id });
    res.json(tasks);
  });

  // 🔹 Accept Task
  app.post('/api/reports/:reportId/accept', async (req, res) => {
    const { reportId } = req.params;
    const { volunteerId } = req.body;

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ error: "Not found" });
    if (report.status !== "Pending") return res.status(400).json({ error: "Not available" });

    report.status = "In Progress";
    report.assignedVolunteerId = volunteerId;
    await report.save();

    res.json(report);
  });

  // 🔹 Complete Task
  app.post('/api/reports/:reportId/complete', async (req, res) => {
    const { reportId } = req.params;
    const { volunteerId } = req.body;

    const report = await Report.findById(reportId);
    const volunteer = await Volunteer.findById(volunteerId);

    if (!report || !volunteer) return res.status(404).json({ error: "Not found" });

    report.status = "Completed";
    volunteer.points += 10;

    await report.save();
    await volunteer.save();

    res.json({ report, points: volunteer.points });
  });

  // 🔥 Vite integration (DON'T TOUCH)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();