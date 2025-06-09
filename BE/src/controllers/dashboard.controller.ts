
import { Request, Response } from 'express';
import prisma from "../prisma";
// import { Event as PrismaEvent, Registration, Review } from "../../generated/prisma";



export class DashboardController{
 async  getStatistic(req: Request, res: Response) {
  const { organizerId } = req.body;

  if (!organizerId || Array.isArray(organizerId)) {
    res.status(400).json({ error: 'Invalid organizer ID' });
    return;
  }

  try {

        const getOrganizerEvents = async (organizerId: number) => {
            return prisma.event.findMany({
                where: { organizerId },
                include: {
                registrations: true,
                reviews: true,
                },
            });
        };

        const events = await getOrganizerEvents(organizerId);
        type EventWithDetails = Awaited<ReturnType<typeof getOrganizerEvents>>[0];

        
        const stats = events.map((event: EventWithDetails) => {
            const totalRevenue = event.registrations.reduce(
                (acc: number, r) => acc + r.finalPrice,
                0
            );
            console.log("Total Revenue: ", totalRevenue);
            
            const averageRating =
                event.reviews.length > 0
                ? event.reviews.reduce(
                    (acc: number, r) => acc + r.rating,
                    0
                    ) / event.reviews.length
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
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}