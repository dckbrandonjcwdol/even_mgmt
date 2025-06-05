import { Router } from "express";
import { EventController } from "../controllers/event.controller";
// import { EventController } from "../controllers/event";

export class EventRouter {
  private readonly router = Router();
  private readonly eventController = new EventController();


  constructor() {
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

  public getRouter() {
    return this.router;
  }
}