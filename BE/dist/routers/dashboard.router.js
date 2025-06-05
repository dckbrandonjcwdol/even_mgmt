"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRouter = void 0;
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
class DashboardRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.dashboardController = new dashboard_controller_1.DashboardController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post('/events-by-org', this.dashboardController.getEventsByOrganizerId);
        this.router.get('/events', this.dashboardController.getEvents);
        this.router.get('/event/:id', this.dashboardController.getEventById);
        this.router.post('/buy-ticket', this.dashboardController.buyTicket);
    }
    getRouter() {
        return this.router;
    }
}
exports.DashboardRouter = DashboardRouter;
