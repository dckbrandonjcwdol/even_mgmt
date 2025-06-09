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
        this.router.post("/", this.dashboardController.getStatistic);
    }
    getRouter() {
        return this.router;
    }
}
exports.DashboardRouter = DashboardRouter;
