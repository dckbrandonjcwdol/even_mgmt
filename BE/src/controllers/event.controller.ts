import { Request, Response } from "express";
import { PrismaClient, Prisma } from "../../generated/prisma";

const prisma = new PrismaClient();

export class EventController {
  constructor() {
    this.getEvents = this.getEvents.bind(this);
  }


  // Menggunakan arrow function agar context this tetap
//   public getEvents = async (req: Request, res: Response) => {
  public async getEvents(req: Request, res: Response) {
    const q = (req.query.q as string) || "";
    const category = (req.query.category as string) || "";
    const location = (req.query.location as string) || "";
    const page = parseInt(req.query.page as string, 10) || 1;

    const take = 6;
    const skip = (page - 1) * take;

    const andConditions: Prisma.EventWhereInput[] = [];

    if (q) {
      andConditions.push({ title: { contains: q, mode: "insensitive" } });
    }
    if (category) {
      andConditions.push({ category });
    }
    if (location) {
      andConditions.push({ location: { contains: location, mode: "insensitive" } });
    }

    const where: Prisma.EventWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    try {
      const [events, count] = await Promise.all([
        prisma.event.findMany({
          where,
          skip,
          take,
          orderBy: { startDate: "asc" },
        }),
        prisma.event.count({ where }),
      ]);

      res.status(200).json({
        events,
        totalPages: Math.ceil(count / take),
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  };


//   public createEventHandler = async (req: Request, res: Response) => {
  public async createEventHandler(req: Request, res: Response) {
    const {
      organizerId,
      title,
      description,
      location,
      startDate,
      endDate,
      price,
      isPaid,
      totalSeats,
      category,
      ticketTypes,
      promotions,
    } = req.body;

    if (!organizerId || !title || !startDate || !endDate || totalSeats == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const event = await prisma.event.create({
        data: {
          organizerId,
          title,
          description,
          location,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          price: isPaid ? price : null,
          isPaid,
          totalSeats,
          availableSeats: totalSeats,
          category,
          ticketTypes: ticketTypes ? { create: ticketTypes } : undefined,
          promotions: promotions ? { create: promotions } : undefined,
        },
      });

      res.status(201).json({ message: "Event created successfully", event });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(400).json({ error: "Failed to create event" });
    }
  };
}
