"use client";

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useSession } from 'next-auth/react';
import axios from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type EventStat = {
  eventId: number;
  title: string;
  totalRegistrations: number;
  totalRevenue: number;
  averageRating: number;
  date: string; // assuming event date
};

export default function EventDashboard() {
  const [stats, setStats] = useState<EventStat[]>([]);
  const [range, setRange] = useState<'year' | 'month' | 'day'>('month');
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const fetchStats = async () => {
        try {
          const response = await axios.post('/dashboard', {
            organizerId: Number(session.user.id),
            range: range,
          });
          setStats(response.data.stats);
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        }
      };

      fetchStats();
    }
  }, [session, status, range]);

  const chartData = {
    labels: stats.map((s) => s.date),
    datasets: [
      {
        label: 'Registrations',
        data: stats.map((s) => s.totalRegistrations),
        borderColor: 'rgb(59,130,246)',
        backgroundColor: 'rgba(59,130,246,0.5)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Revenue (Rp)',
        data: stats.map((s) => s.totalRevenue),
        borderColor: 'rgb(16,185,129)',
        backgroundColor: 'rgba(16,185,129,0.5)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Event Dashboard</h1>

      <Tabs defaultValue={range} onValueChange={(val) => setRange(val as 'year' | 'month' | 'day')}>
        <TabsList className="mb-4">
          <TabsTrigger value="year">Year</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="day">Day</TabsTrigger>
        </TabsList>

        <TabsContent value={range}>
          <Card>
            <CardContent className="p-4">
              <Line data={chartData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.eventId}>
            <CardContent className="space-y-2 p-4">
              <h2 className="text-xl font-semibold">{stat.title}</h2>
              <p className="text-sm text-gray-600">Date: {new Date(stat.date).toLocaleDateString('id-ID')}</p>
              <p>Registrations: {stat.totalRegistrations}</p>
              <p>Revenue: Rp. {stat.totalRevenue.toLocaleString('id-ID')}</p>
              <p>Rating: {stat.averageRating.toFixed(1)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
