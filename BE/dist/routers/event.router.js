"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRouter = void 0;
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
// import { EventController } from "../controllers/event";
class EventRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.eventController = new event_controller_1.EventController();
        // this.router.get("/events", this.eventController.getEvents);
        this.router.post("/event", this.eventController.createEvent);
        this.router.get("/locations", this.eventController.getLocation);
        this.router.get("/categories", this.eventController.getCategory);
        // this.router.post("/event-create", this.eventController.createEventHandler);
    }
    getRouter() {
        return this.router;
    }
}
exports.EventRouter = EventRouter;
