
import { Request, Response } from 'express';
import prisma from '../prisma';

export class DashboardController {

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
          createdAt: "asc",
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

      res.status(400).json({ registrationId: registration.id });
      return ;

    } catch (error) {
      console.error(error);
      res.status(500).json({  message: "Internal server error"  });
    }
  }

}