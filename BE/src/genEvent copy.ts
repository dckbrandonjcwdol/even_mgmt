import axios from 'axios';

interface TicketType {
  name: string;
  price: number;
  quota: number;
}

interface Promotion {
  code: string;
  description: string;
  discountPercentage: number;
  maxUsage: number;
  validUntil: string;
}

interface EventPayload {
  organizerId: number;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  isPaid: boolean;
  price: number;
  totalSeats: number;
  category: string;
  ticketTypes: TicketType[];
  promotions: Promotion[];
}

const baseUrl = 'http://localhost:8000/api/event';

async function sendEvents() {
  for (let i = 1; i <= 50; i++) {
    const payload: EventPayload = {
      organizerId: 1,
      title: `Konser Kla-Project 25 Tahun #${i}`,
      description: 'Pagelaran musik Kla-Project untuk merayakan Ulang Tahun yang ke-25',
      location: 'ICEBSD',
      startDate: '2025-06-01T09:00:00Z',
      endDate: '2025-06-02T17:00:00Z',
      isPaid: true,
      price: 500000,
      totalSeats: 100,
      category: 'Technology',
      ticketTypes: [
        {
          name: 'Regular',
          price: 500000,
          quota: 80,
        },
        {
          name: 'VIP',
          price: 1000000,
          quota: 20,
        },
      ],
      promotions: [
        {
          code: `KLAEARLYBIRD${i}`,
          description: 'Diskon 20% untuk pendaftaran awal',
          discountPercentage: 20,
          maxUsage: 50,
          validUntil: '2025-05-30T23:59:59Z',
        },
      ],
    };

    try {
      const response = await axios.post(baseUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(`✔️ Event #${i} sent:`, response.status);
    } catch (error: any) {
      console.error(`❌ Failed to send event #${i}:`, error.response?.data || error.message);
    }
  }
}

sendEvents();
