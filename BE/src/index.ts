import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";

import { AuthRouter } from "./routers/auth.router";
import { EventRouter } from "./routers/event.router";

const PORT: number = 8000;

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Static file serving (akses gambar/file di folder public)
app.use("/api/public", express.static(path.join(__dirname, "../public")));

// Root route
app.get("/api", (req: Request, res: Response) => {
  res.status(200).send({ message: "Welcome to my API" });
});

// Router registrations
const authRouter = new AuthRouter();
app.use("/api/auth", authRouter.getRouter());

const eventRouter = new EventRouter();
app.use("/api/", eventRouter.getRouter());

// Start server
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/api`);
});
