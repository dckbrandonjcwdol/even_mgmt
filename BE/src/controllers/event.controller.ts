import { Request, Response } from "express";
import prisma from "../prisma";

// const prisma = new PrismaClient();

export class EventController{
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
            categoryId,
            ticketTypes,
            promotions
            } = req.body;

            const totalSeats = ticketTypes?.reduce(
            (acc: number, ticket: any) => acc + Number(ticket.quota || 0),
            0
            );

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
                create:
                    ticketTypes?.map((ticket: any) => ({
                    name: ticket.name,
                    price: ticket.price,
                    quota: ticket.quota,
                    })) || [],
                },
                promotions: {
                create:
                    promotions?.map((promo: any) => ({
                    code: promo.code,
                    description: promo.description,
                    discountPercentage: promo.discountPercentage,
                    discountAmount: promo.discountAmount,
                    maxUsage: promo.maxUsage,
                    validUntil: new Date(promo.validUntil),
                    })) || [],
                },
            },
        });

        res.status(201).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create event (be)" });
    }
    }


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
            ticketTypes: {
            select: {
                name: true,
                price: true,
            }
            }          
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
        where: { eventId: id },
        orderBy: {
            name: "asc",  // urutkan ascending berdasarkan field 'name'
        },        
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

//   async buyTicket(req: Request, res: Response) {


//     const { customerId, eventId, ticketTypeId, quantity } = req.body;

//     if (!customerId || !eventId || !ticketTypeId || !quantity) {
//       res.status(400).json({ message: "Invalid data" });
//       return ;
//     }

//     try {
//       const ticketType = await prisma.ticketType.findUnique({
//         where: { id: parseInt(ticketTypeId) },
//       });

//       if (!ticketType || ticketType.quota < quantity) {
//         res.status(400).json({ message: "IInsufficient ticket quota data" });
//         return ;

//       }

//       const finalPrice = ticketType.price * quantity;

//       // Create registration(s)
//       const registration = await prisma.registration.create({
//         data: {
//           userId: parseInt(customerId),
//           eventId: parseInt(eventId),
//           ticketTypeId: parseInt(ticketTypeId),
//           finalPrice: finalPrice,
//           status: "PAID", // atau 'PENDING' tergantung logika Anda
//         },
//       });

//       // Update quota
//       await prisma.ticketType.update({
//         where: { id: parseInt(ticketTypeId) },
//         data: { quota: ticketType.quota - quantity },
//       });

//       // Update event
//         // Ambil data event terlebih dahulu
//         const event = await prisma.event.findUnique({
//         where: { id: parseInt(eventId) },
//         });

//         if (!event) {
//             res.status(404).json({ error: "Event not found" });
//             return 
//         }

//         // Hitung nilai baru dan update
//         await prisma.event.update({
//         where: { id: parseInt(eventId) },
//         data: { availableSeats: event.availableSeats - quantity },
//         });

//       res.status(200).json({ registrationId: registration.id });
//       return ;

//     } catch (error) {
//       console.error(error);
//       res.status(500).json({  message: "Internal server error"  });
//     }
//   }


    async buyTicket(req: Request, res: Response) {
        const { customerId, eventId, ticketTypeId, quantity } = req.body;

        // Hentikan proses setelah log (debug only)
        // return res.status(200).json({ message: "Debug only - proses dihentikan." });        
        
        if (!customerId || !eventId || !ticketTypeId || !quantity) {
            res.status(400).json({ message: "Invalid data" });
            return;
        }

        try {
            const ticketType = await prisma.ticketType.findUnique({
            where: { id: parseInt(ticketTypeId) },
            });

            console.log("Req Body: ", req.body);
            console.log("ticketType: ", ticketType);

            if (!ticketType || ticketType.quota < quantity) {
            res.status(400).json({ message: "Insufficient ticket quota" });
            return;
            }

            const rawFinalPrice = ticketType.price * quantity;

            console.log("rawFinalPrice: ", rawFinalPrice);

            // 1. Hitung total point user yang tersedia (tidak expired & belum diredeem)
            const now = new Date();
            const points = await prisma.point.findMany({
            where: {
                userId: parseInt(customerId),
                redeemed: false,
                expiresAt: { gt: now },
            },
            });

            console.log("Points: ", points);
            const totalAvailablePoints = points.reduce((sum, p) => sum + p.points, 0);

            // 2. Bandingkan dengan finalPrice
            const usedPoints = Math.min(totalAvailablePoints, rawFinalPrice);
            const finalPrice = rawFinalPrice - usedPoints;

            // 3. Buat registration
            const registration = await prisma.registration.create({
            data: {
                userId: parseInt(customerId),
                eventId: parseInt(eventId),
                ticketTypeId: parseInt(ticketTypeId),
                finalPrice,
                usedPoints,
                status: "PAID",
            },
            });

            // 4. Update ticket quota
            await prisma.ticketType.update({
            where: { id: parseInt(ticketTypeId) },
            data: { quota: ticketType.quota - quantity },
            });

            // 5. Update availableSeats event
            const event = await prisma.event.findUnique({
            where: { id: parseInt(eventId) },
            });

            if (!event) {
            res.status(404).json({ error: "Event not found" });
            return;
            }

            await prisma.event.update({
            where: { id: parseInt(eventId) },
            data: { availableSeats: event.availableSeats - quantity },
            });

            // 6. Tandai point yang digunakan sebagai redeemed
            if (usedPoints > 0) {
            let remaining = usedPoints;

            for (const point of points) {
                if (remaining <= 0) break;

                await prisma.point.update({
                where: { id: point.id },
                data: { redeemed: true },
                });

                remaining -= point.points;
            }

            // 7. Tambah data ke Redemption
            await prisma.redemption.create({
                data: {
                userId: parseInt(customerId),
                registrationId: registration.id,
                pointsUsed: usedPoints,
                },
            });
            }

            res.status(200).json({ registrationId: registration.id, finalPrice:finalPrice, usedPoints: usedPoints });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error", error });
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


  async getPoints(req: Request, res: Response) {
    const { userId } = req.body;
     try {
        const totalPoints = await prisma.point.aggregate({
          _sum: {
            points: true,
          },
          where: {
            userId: userId,
            redeemed: false,  // hanya yang belum diredeem
            expiresAt: {
              gt: new Date(), // pastikan points belum kadaluarsa (opsional)
            },
          },
        });

        res.status(200).json(totalPoints);
      }catch(err){
        console.log(err);
        res.status(400).send({ error: 'Failed to get points', detail: err });
      }     
  }

}