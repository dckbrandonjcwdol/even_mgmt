"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const auth_router_1 = require("./routers/auth.router");
const event_router_1 = require("./routers/event.router");
const PORT = 8000;
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Static file serving (akses gambar/file di folder public)
app.use("/api/public", express_1.default.static(path_1.default.join(__dirname, "../public")));
// Root route
app.get("/api", (req, res) => {
    res.status(200).send({ message: "Welcome to Event Management API" });
});
// Router registrations
const authRouter = new auth_router_1.AuthRouter();
app.use("/api/auth", authRouter.getRouter());
const eventRouter = new event_router_1.EventRouter();
app.use("/api/", eventRouter.getRouter());
// Start server
app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}/api`);
});
