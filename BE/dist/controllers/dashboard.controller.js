"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class DashboardController {
    async getEvents(req, res) {
        try {
            const { organizerId } = req.body;
            if (!organizerId) {
                res.status(400).json({ error: 'Missing organizerId in request body' });
                return;
            }
            const events = await prisma_1.default.event.findMany({
                where: {
                    organizerId: Number(organizerId),
                },
            });
            res.status(200).json(events);
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ error: 'Failed to get events', detail: err });
        }
    }
}
exports.DashboardController = DashboardController;
