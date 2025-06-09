// src/components/EventDashboard.tsx
"use client";

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, Title } from 'chart.js';
import { useSession } from 'next-auth/react';
import axios from '@/lib/axios';
// import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title);

type EventStat = {
  eventId: number;
  title: string;
  totalRegistrations: number;
  totalRevenue: number;
  averageRating: number;
};

export default function EventDashboard() {
  const [stats, setStats] = useState<EventStat[]>([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const fetchStats = async () => {
        try {
          const response = await axios.post('/dashboard', {
            organizerId: Number(session.user.id),
          });
          // console.log("Response: ", response);

          setStats(response.data.stats);
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        }
      };

      fetchStats();
    }
  }, [session, status]);

  console.log("Stats: ",stats);
  
  const chartData = {
    labels: stats.map((s) => s.title),
    datasets: [
      {
        label: 'Registrations',
        data: stats.map((s) => s.totalRegistrations),
        borderColor: 'rgb(59,130,246)',
        backgroundColor: 'rgba(59,130,246,0.5)',
      },
      {
        label: 'Revenue',
        data: stats.map((s) => s.totalRevenue),
        borderColor: 'rgb(16,185,129)',
        backgroundColor: 'rgba(16,185,129,0.5)',
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Event Dashboard</h1>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.eventId} className="p-4 bg-white shadow rounded-xl">
            <h2 className="text-xl font-semibold">{stat.title}</h2>
            <p>Registrations: {stat.totalRegistrations}</p>
            <p>Revenue: Rp. {stat.totalRevenue.toLocaleString('id-ID')}</p>
            <p>Rating: {stat.averageRating.toFixed(1)}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 shadow rounded-xl">
        <Line data={chartData} />
      </div>
    </div>
  );
}
