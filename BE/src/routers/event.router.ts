import { Router } from "express";
import { EventController } from "../controllers/event.controller";

export class EventRouter {
  private readonly router = Router();
  private readonly eventController = new EventController();

  constructor() {
    this.router.get("/events", this.eventController.getEvents);
    // this.router.post("/event-create", this.eventController.createEventHandler);
  }

  public getRouter() {
    return this.router;
  }
}