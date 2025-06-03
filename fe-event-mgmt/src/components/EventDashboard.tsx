"use client";

import { getEventsByOrganizer } from '@/lib/api';
import React, { useEffect, useState } from 'react';


interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  totalSeats: number;
  availableSeats: number;
  price: number | null;
  isPaid: boolean;
}

interface EventStats extends Event {
  registered: number;
  filledSeats: number;
  revenue: number;
}

const EventDashboard: React.FC<{ organizerId?: number }> = ({ organizerId = 1 }) => {
  const [events, setEvents] = useState<EventStats[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("organizerId: " + organizerId);
        const data = await getEventsByOrganizer(organizerId);
        console.log("organizerId after: " + organizerId);

        const stats = data.map((event: Event) => {
          const filledSeats = event.totalSeats - event.availableSeats;
          const revenue = event.isPaid && event.price ? filledSeats * event.price : 0;

          return {
            ...event,
            registered: filledSeats,
            filledSeats,
            revenue,
          };
        });

        setEvents(stats);
      } catch (err) {
        console.error('Error fetching events', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [organizerId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 relative top-[4250px]">
      <h1 className="text-xl font-bold mb-4">My Events</h1>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{event.title}</h2>
              <p>{event.description}</p>
              <p>
                <strong>Schedule:</strong> {new Date(event.startDate).toLocaleString()} –{' '}
                {new Date(event.endDate).toLocaleString()}
              </p>
              <p>
                <strong>Total Seats:</strong> {event.totalSeats} | <strong>Registered:</strong>{' '}
                {event.registered}
              </p>
              <p>
                <strong>Revenue:</strong> Rp {event.revenue.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventDashboard;
