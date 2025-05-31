import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      organizerId,
      title,
      description,
      location,
      startDate,
      endDate,
      isPaid,
      price,
      totalSeats,
      category,
      ticketTypes,
      promotions
    } = req.body;

    const event = await prisma.event.create({
      data: {
        organizerId: parseInt(organizerId),
        title,
        description: description || "",
        location: location || "",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isPaid,
        price: isPaid ? price : null,
        totalSeats,
        availableSeats: totalSeats,
        category: category || "",
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
    res.status(500).json({ error: "Failed to create event" });
  }
};
