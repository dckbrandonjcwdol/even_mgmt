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
  location: string; // Prisma enum dikirim sebagai string
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

// Daftar lokasi sinkron dengan enum Prisma
const locationOptions = [
  'JCCSenayan',
  'BalaiKartini',
  'TheKasablankaHall',
  'ICEBSD',
  'HotelMulia',
  'DjakartaTheater',
  'TransConventionCenter',
  'Sabuga',
  'HarrisCiumbuleuit',
  'EldoradoDago',
  'PullmanHotelBandung',
  'GrandCityConvex',
  'DyandraConvention',
  'CiputraWorldSurabaya',
  'ShangriLaSurabaya',
  'PakuwonMall',
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
    const payload: EventPayload = {
      organizerId: 1,
      title: `${getRandom(titles)} #${i}`,
      description: getRandom(descriptions),
      location: getRandom(locationOptions),
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
      console.log(`✔️ Event #${i} sent to ${payload.location}: ${response.status}`);
    } catch (error: any) {
      console.error(`❌ Failed to send event #${i}:`, error.response?.data || error.message);
    }
  }
}

sendEvents();
