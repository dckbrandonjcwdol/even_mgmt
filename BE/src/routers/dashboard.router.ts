import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";

export class DashboardRouter {
  private readonly router = Router();
  private readonly dashboardController = new DashboardController();

  constructor() {
    
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/", this.dashboardController.getStatistic);
  }

  public getRouter() {
    return this.router;
  }
}
