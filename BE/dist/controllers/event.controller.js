"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
// const prisma = new PrismaClient();
class EventController {
    async createEvent(req, res) {
        try {
            const { organizerId, title, description, locationId, startDate, endDate, isPaid, price, totalSeats, categoryId, ticketTypes, promotions } = req.body;
            const event = await prisma_1.default.event.create({
                data: {
                    organizerId: parseInt(organizerId),
                    title,
                    description: description || "",
                    locationId: parseInt(locationId),
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    isPaid,
                    price: isPaid ? price : null,
                    totalSeats,
                    availableSeats: totalSeats,
                    categoryId: parseInt(categoryId),
                    ticketTypes: {
                        create: (ticketTypes === null || ticketTypes === void 0 ? void 0 : ticketTypes.map((ticket) => ({
                            name: ticket.name,
                            price: ticket.price,
                            quota: ticket.quota,
                        }))) || []
                    },
                    promotions: {
                        create: (promotions === null || promotions === void 0 ? void 0 : promotions.map((promo) => ({
                            code: promo.code,
                            description: promo.description,
                            discountPercentage: promo.discountPercentage,
                            discountAmount: promo.discountAmount,
                            maxUsage: promo.maxUsage,
                            validUntil: new Date(promo.validUntil),
                        }))) || []
                    }
                }
            });
            res.status(201).json(event);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to create event (be)" });
        }
    }
    ;
    async getLocation(req, res) {
        try {
            const location = await prisma_1.default.location.findMany();
            res.status(200).json(location);
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ error: 'Failed to get locations', detail: err });
        }
    }
    async getCategory(req, res) {
        try {
            const categories = await prisma_1.default.category.findMany();
            res.status(200).json(categories);
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ error: 'Failed to get locations', detail: err });
        }
    }
}
exports.EventController = EventController;
