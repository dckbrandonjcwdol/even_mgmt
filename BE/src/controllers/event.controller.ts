import { Request, Response } from "express";
import prisma from "../prisma";

// const prisma = new PrismaClient();

export class EventController{
    async createEvent(req: Request, res: Response) {
        try {
            const {
            organizerId,
            title,
            description,
            locationId,
            startDate,
            endDate,
            isPaid,
            price,
            totalSeats,
            categoryId,
            ticketTypes,
            promotions
            } = req.body;

            const event = await prisma.event.create({
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
                create: ticketTypes?.map((ticket: any) => ({
                    name: ticket.name,
                    price: ticket.price,
                    quota: ticket.quota,
                })) || []
                },
                promotions: {
                create: promotions?.map((promo: any) => ({
                    code: promo.code,
                    description: promo.description,
                    discountPercentage: promo.discountPercentage,
                    discountAmount: promo.discountAmount,
                    maxUsage: promo.maxUsage,
                    validUntil: new Date(promo.validUntil),
                })) || []
                }
            }
            });

            res.status(201).json(event);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to create event (be)" });
        }
    };

    async getLocation(req: Request, res: Response) {
        try {
            const location = await prisma.location.findMany();
            res.status(200).json(location);
        }catch(err){
            console.log(err);
            res.status(400).send({ error: 'Failed to get locations', detail: err });
        }     
    }

    async getCategory(req: Request, res: Response) {
        try {
            const categories = await prisma.category.findMany();
            res.status(200).json(categories);
        }catch(err){
            console.log(err);
            res.status(400).send({ error: 'Failed to get locations', detail: err });
        }     
    }


  async getEventsByOrganizerId (req: Request, res: Response) {
    try {
      const { organizerId } = req.body;

      if (!organizerId) {
        res.status(400).json({ error: 'Missing organizerId in request body' });
        return 
      }

      const events = await prisma.event.findMany({
        where: {
          organizerId: Number(organizerId),
        },
      });

      res.status(200).json(events);
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: 'Failed to get events', detail: err });
    }
  }

  async getEvents(req: Request, res: Response) {
    try {
      const events = await prisma.event.findMany({
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
        },
      });

      res.status(200).json(events);
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: 'Failed to get events', detail: err });
    }
  }

  async getEventById(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid event id" });
      return;
    }

    try {
      const event = await prisma.event.findFirst({
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
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get event", detail: err });
    }
  }

 async getTickectType(req: Request, res: Response) {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid event id" });
      return;
    }

    try {
      const ticketType = await prisma.ticketType.findMany({
        where: { eventId: id }
      });

      if (!ticketType) {
        res.status(404).json({ error: "ticketType not found" });
        return;
      }

      res.status(200).json(ticketType);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to get ticketType", detail: err });
    }
  }

  async buyTicket(req: Request, res: Response) {


    const { customerId, eventId, ticketTypeId, quantity } = req.body;

    if (!customerId || !eventId || !ticketTypeId || !quantity) {
      res.status(400).json({ message: "Invalid data" });
      return ;
    }

    try {
      const ticketType = await prisma.ticketType.findUnique({
        where: { id: parseInt(ticketTypeId) },
      });

      if (!ticketType || ticketType.quota < quantity) {
        res.status(400).json({ message: "IInsufficient ticket quota data" });
        return ;

      }

      const finalPrice = ticketType.price * quantity;

      // Create registration(s)
      const registration = await prisma.registration.create({
        data: {
          userId: parseInt(customerId),
          eventId: parseInt(eventId),
          ticketTypeId: parseInt(ticketTypeId),
          finalPrice: finalPrice,
          status: "PAID", // atau 'PENDING' tergantung logika Anda
        },
      });

      // Update quota
      await prisma.ticketType.update({
        where: { id: parseInt(ticketTypeId) },
        data: { quota: ticketType.quota - quantity },
      });

      res.status(200).json({ registrationId: registration.id });
      return ;

    } catch (error) {
      console.error(error);
      res.status(500).json({  message: "Internal server error"  });
    }
  }


async getBuyConfirmation(req: Request, res: Response) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid registration id" });
    return;
  }

  try {
    const registration = await prisma.registration.findUnique({
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
      eventTitle: registration.event?.title || "Unknown Event",
    //   eventLocation: registration.event?.location || "Unknown Location",
    //   eventDate: registration.event?.date || null,
      ticketType: registration.ticketType?.name || "Unknown Ticket",
    //   quantity: registration.quantity,
      totalPrice: registration.finalPrice,
      createdAt: registration.createdAt,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get confirmation details", detail: err });
  }
}


}