import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";

export class DashboardRouter {
  private readonly router = Router();
  private readonly dashboardController = new DashboardController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
       this.router.post('/events-by-org', this.dashboardController.getEventsByOrganizerId);
       this.router.get('/events', this.dashboardController.getEvents);
       this.router.get('/event/:id', this.dashboardController.getEventById);
       this.router.post('/buy-ticket', this.dashboardController.buyTicket);

  }

  public getRouter() {
    return this.router;
  }
}
