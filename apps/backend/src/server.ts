import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { authRouter } from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import { authenticate } from "./middleware/auth";
import { requireRole } from "./middleware/requireRole";
import { adminRouter } from "./routes/admin.routes";
import { aiRouter } from "./routes/ai.routes";
import { facultyRouter } from "./routes/faculty.routes";
import { studentRouter } from "./routes/student.routes";
import { timetableRouter } from "./routes/timetable.routes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    data: {
      service: "campusiq-api",
      status: "ok",
      phase: "foundation"
    }
  });
});

app.get("/api", (_req, res) => {
  res.json({
    success: true,
    data: {
      name: "CampusIQ API",
      version: "0.1.0"
    }
  });
});

app.use("/api/auth", authRouter);
app.use("/api/student", authenticate, requireRole("STUDENT"), studentRouter);
app.use("/api/faculty", authenticate, requireRole("FACULTY"), facultyRouter);
app.use("/api/admin", authenticate, requireRole("ADMIN"), adminRouter);
app.use("/api/ai", authenticate, requireRole("STUDENT"), aiRouter);
app.use("/api/timetable", authenticate, requireRole("ADMIN"), timetableRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`CampusIQ API listening on http://localhost:${port}`);
});
