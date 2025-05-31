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
  locationId: number;
  startDate: string;
  endDate: string;
  isPaid: boolean;
  price: number;
  totalSeats: number;
  categoryId: number; // sudah dikoreksi
  ticketTypes: TicketType[];
  promotions: Promotion[];
}

const baseUrl = 'http://localhost:8000/api/event';

const locationOptions = [
  { id: 1, name: 'JCC Senayan' },
  { id: 2, name: 'Balai Kartini' },
  { id: 3, name: 'The Kasablanka Hall' },
  { id: 4, name: 'ICE BSD' },
  { id: 5, name: 'Hotel Mulia' },
  { id: 6, name: 'Djakarta Theater' },
  { id: 7, name: 'Trans Convention Center' },
  { id: 8, name: 'Sabuga' },
  { id: 9, name: 'Harris Ciumbuleuit' },
  { id: 10, name: 'Eldorado Dago' },
  { id: 11, name: 'Pullman Hotel Bandung' },
  { id: 12, name: 'Grand City Convex' },
  { id: 13, name: 'Dyandra Convention' },
  { id: 14, name: 'Ciputra World Surabaya' },
  { id: 15, name: 'Shangri-La Surabaya' },
  { id: 16, name: 'Pakuwon Mall' },
];


const titles = [
  'Tech Future 2025',
  'Music & AI Fusion',
  'Startup Connect',
  'Developer Festival',
  'Digital Evolution Summit',
  'Gadget & Game Expo',
  'Smart City Conference',
  'NextGen Coding Day',
  'AI in Music Experience',
  'Quantum Tech Talk',
];


const descriptions = [
  'Sebuah perayaan inovasi dan teknologi masa depan.',
  'Festival untuk penggemar teknologi dan musik.',
  'Ajang berkumpul para startup dan investor.',
  'Konferensi besar untuk komunitas developer se-Indonesia.',
  'Pameran tren digital terkini dan masa depan.',
  'Perpaduan seni dan kecanggihan AI.',
  'Peluncuran platform smart city terbaru.',
  'Pelatihan dan showcase aplikasi AI untuk umum.',
  'Konser interaktif dengan teknologi metaverse.',
  'Pembicaraan mendalam tentang quantum computing.',
];


function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function sendEvents() {
  for (let i = 1; i <= 50; i++) {
    const location = getRandom(locationOptions);

    const payload: EventPayload = {
      organizerId: 1,
      title: `${getRandom(titles)} #${i}`,
      description: getRandom(descriptions),
      locationId: location.id,
      startDate: '2025-06-01T09:00:00Z',
      endDate: '2025-06-02T17:00:00Z',
      isPaid: true,
      price: 500000,
      totalSeats: 100,
      categoryId: 1, // asumsi ID 1 untuk "Technology"
      ticketTypes: [
        { name: 'Regular', price: 500000, quota: 80 },
        { name: 'VIP', price: 1000000, quota: 20 },
      ],
      promotions: [
        {
          code: `PROMO${i}`,
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
      console.log(`✔️ Event #${i} sent to location ID ${payload.locationId}: ${response.status}`);
    } catch (error: any) {
      console.error(`❌ Failed to send event #${i}:`, error.response?.data || error.message);
    }
  }
}

sendEvents();
