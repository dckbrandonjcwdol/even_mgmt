"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
// const prisma = new PrismaClient();
class EventController {
    // async createEvent(req: Request, res: Response) {
    //     try {
    //         const {
    //         organizerId,
    //         title,
    //         description,
    //         locationId,
    //         startDate,
    //         endDate,
    //         isPaid,
    //         price,
    //         totalSeats,
    //         categoryId,
    //         ticketTypes,
    //         promotions
    //         } = req.body;
    //         const event = await prisma.event.create({
    //         data: {
    //             organizerId: parseInt(organizerId),
    //             title,
    //             description: description || "",
    //             locationId: parseInt(locationId),
    //             startDate: new Date(startDate),
    //             endDate: new Date(endDate),
    //             isPaid,
    //             price: isPaid ? price : null,
    //             totalSeats,
    //             availableSeats: totalSeats,
    //             categoryId: parseInt(categoryId),
    //             ticketTypes: {
    //             create: ticketTypes?.map((ticket: any) => ({
    //                 name: ticket.name,
    //                 price: ticket.price,
    //                 quota: ticket.quota,
    //             })) || []
    //             },
    //             promotions: {
    //             create: promotions?.map((promo: any) => ({
    //                 code: promo.code,
    //                 description: promo.description,
    //                 discountPercentage: promo.discountPercentage,
    //                 discountAmount: promo.discountAmount,
    //                 maxUsage: promo.maxUsage,
    //                 validUntil: new Date(promo.validUntil),
    //             })) || []
    //             }
    //         }
    //         });
    //         res.status(201).json(event);
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ error: "Failed to create event (be)" });
    //     }
    // };
    async createEvent(req, res) {
        try {
            const { organizerId, title, description, locationId, startDate, endDate, isPaid, price, categoryId, ticketTypes, promotions } = req.body;
            const totalSeats = ticketTypes === null || ticketTypes === void 0 ? void 0 : ticketTypes.reduce((acc, ticket) => acc + Number(ticket.quota || 0), 0);
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
                        }))) || [],
                    },
                    promotions: {
                        create: (promotions === null || promotions === void 0 ? void 0 : promotions.map((promo) => ({
                            code: promo.code,
                            description: promo.description,
                            discountPercentage: promo.discountPercentage,
                            discountAmount: promo.discountAmount,
                            maxUsage: promo.maxUsage,
                            validUntil: new Date(promo.validUntil),
                        }))) || [],
                    },
                },
            });
            res.status(201).json(event);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to create event (be)" });
        }
    }
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
    async getEventsByOrganizerId(req, res) {
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
    async getEvents(req, res) {
        try {
            const events = await prisma_1.default.event.findMany({
                orderBy: {
                    createdAt: "desc",
                },
                take: 9,
                include: {
                    location: {
                        select: { name: true },
                    },
                    category: {
                        select: { name: true },
                    },
                    ticketTypes: {
                        select: {
                            name: true,
                            price: true,
                        }
                    }
                },
            });
            res.status(200).json(events);
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ error: 'Failed to get events', detail: err });
        }
    }
    async getEventById(req, res) {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid event id" });
            return;
        }
        try {
            const event = await prisma_1.default.event.findFirst({
                where: { id: id },
                include: {
                    location: { select: { name: true } },
                    category: { select: { name: true } },
                },
            });
            if (!event) {
                res.status(404).json({ error: "Event not found" });
                return;
            }
            res.status(200).json(event);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to get event", detail: err });
        }
    }
    async getTickectType(req, res) {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid event id" });
            return;
        }
        try {
            const ticketType = await prisma_1.default.ticketType.findMany({
                where: { eventId: id },
                orderBy: {
                    name: "asc", // urutkan ascending berdasarkan field 'name'
                },
            });
            if (!ticketType) {
                res.status(404).json({ error: "ticketType not found" });
                return;
            }
            res.status(200).json(ticketType);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to get ticketType", detail: err });
        }
    }
    async buyTicket(req, res) {
        const { customerId, eventId, ticketTypeId, quantity } = req.body;
        if (!customerId || !eventId || !ticketTypeId || !quantity) {
            res.status(400).json({ message: "Invalid data" });
            return;
        }
        try {
            const ticketType = await prisma_1.default.ticketType.findUnique({
                where: { id: parseInt(ticketTypeId) },
            });
            if (!ticketType || ticketType.quota < quantity) {
                res.status(400).json({ message: "IInsufficient ticket quota data" });
                return;
            }
            const finalPrice = ticketType.price * quantity;
            // Create registration(s)
            const registration = await prisma_1.default.registration.create({
                data: {
                    userId: parseInt(customerId),
                    eventId: parseInt(eventId),
                    ticketTypeId: parseInt(ticketTypeId),
                    finalPrice: finalPrice,
                    status: "PAID", // atau 'PENDING' tergantung logika Anda
                },
            });
            // Update quota
            await prisma_1.default.ticketType.update({
                where: { id: parseInt(ticketTypeId) },
                data: { quota: ticketType.quota - quantity },
            });
            // Update event
            // Ambil data event terlebih dahulu
            const event = await prisma_1.default.event.findUnique({
                where: { id: parseInt(eventId) },
            });
            if (!event) {
                res.status(404).json({ error: "Event not found" });
                return;
            }
            // Hitung nilai baru dan update
            await prisma_1.default.event.update({
                where: { id: parseInt(eventId) },
                data: { availableSeats: event.availableSeats - quantity },
            });
            res.status(200).json({ registrationId: registration.id });
            return;
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async getBuyConfirmation(req, res) {
        var _a, _b;
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid registration id" });
            return;
        }
        try {
            const registration = await prisma_1.default.registration.findUnique({
                where: { id: id },
                include: {
                    event: true,
                    ticketType: true,
                },
            });
            if (!registration) {
                res.status(404).json({ error: "Registration not found" });
                return;
            }
            const response = {
                eventTitle: ((_a = registration.event) === null || _a === void 0 ? void 0 : _a.title) || "Unknown Event",
                //   eventLocation: registration.event?.location || "Unknown Location",
                //   eventDate: registration.event?.date || null,
                ticketType: ((_b = registration.ticketType) === null || _b === void 0 ? void 0 : _b.name) || "Unknown Ticket",
                //   quantity: registration.quantity,
                totalPrice: registration.finalPrice,
                createdAt: registration.createdAt,
            };
            res.status(200).json(response);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to get confirmation details", detail: err });
        }
    }
    async getPoints(req, res) {
        const { userId } = req.body;
        try {
            const totalPoints = await prisma_1.default.point.aggregate({
                _sum: {
                    points: true,
                },
                where: {
                    userId: userId,
                    redeemed: false, // hanya yang belum diredeem
                    expiresAt: {
                        gt: new Date(), // pastikan points belum kadaluarsa (opsional)
                    },
                },
            });
            res.status(200).json(totalPoints);
        }
        catch (err) {
            console.log(err);
            res.status(400).send({ error: 'Failed to get points', detail: err });
        }
    }
}
exports.EventController = EventController;
