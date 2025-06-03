
import { Request, Response } from 'express';
import prisma from '../prisma';


export class DashboardController {

  async getEvents (req: Request, res: Response) {
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



}