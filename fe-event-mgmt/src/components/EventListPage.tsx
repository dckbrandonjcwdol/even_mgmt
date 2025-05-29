// src/components/EventListPage.tsx
"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
}

export default function EventListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events', {
        params: { q: query, category, location, page },
      });
      setEvents(res.data.events);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const debouncedSearch = debounce((value: string) => {
    setQuery(value);
    setPage(1);
  }, 500);

  useEffect(() => {
    fetchEvents();
  }, [query, category, location, page]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <input
        type="text"
        placeholder="Search events..."
        onChange={(e) => debouncedSearch(e.target.value)}
        className="border px-2 py-1 mb-2 w-full"
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div key={event.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p>{event.description.slice(0, 100)}...</p>
            <p className="text-sm text-gray-600">{event.location}</p>
            <a href={`/events/${event.id}`} className="text-blue-500 mt-2 block">
              Details
            </a>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2 items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
