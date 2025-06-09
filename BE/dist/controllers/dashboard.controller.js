"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
// import { Event as PrismaEvent, Registration, Review } from "../../generated/prisma";
class DashboardController {
    async getStatistic(req, res) {
        const { organizerId } = req.body;
        if (!organizerId || Array.isArray(organizerId)) {
            res.status(400).json({ error: 'Invalid organizer ID' });
            return;
        }
        try {
            const getOrganizerEvents = async (organizerId) => {
                return prisma_1.default.event.findMany({
                    where: { organizerId },
                    include: {
                        registrations: true,
                        reviews: true,
                    },
                });
            };
            const events = await getOrganizerEvents(organizerId);
            const stats = events.map((event) => {
                const totalRevenue = event.registrations.reduce((acc, r) => acc + r.finalPrice, 0);
                console.log("Total Revenue: ", totalRevenue);
                const averageRating = event.reviews.length > 0
                    ? event.reviews.reduce((acc, r) => acc + r.rating, 0) / event.reviews.length
                    : 0;
                return {
                    eventId: event.id,
                    title: event.title,
                    totalRegistrations: event.registrations.length,
                    totalRevenue,
                    averageRating,
                };
            });
            res.status(200).json({ events, stats });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}
exports.DashboardController = DashboardController;
