'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    axios.get(`/api/stats?userId=1&range=month`).then(res => setStats(res.data));
  }, []);

  if (!stats) return <div className="p-4">Loading...</div>;

  const eventData = stats.stats.byEvent.map((e: any) => ({
    name: e.title,
    Registrations: e.registrations.length,
  }));

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Event Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Registrations per Event</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Registrations" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
