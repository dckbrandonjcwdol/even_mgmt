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
        this.router.post('/events-by-org', this.eventController.getEventsByOrganizerId);
        this.router.get('/events', this.eventController.getEvents);
        this.router.get('/event/:id', this.eventController.getEventById);
        this.router.get('/ticket-type/:id', this.eventController.getTickectType);
        this.router.post('/buy-ticket', this.eventController.buyTicket);
        this.router.get('/confirmation/:id', this.eventController.getBuyConfirmation);
        // this.router.post("/event-create", this.eventController.createEventHandler);
    }
    getRouter() {
        return this.router;
    }
}
exports.EventRouter = EventRouter;
