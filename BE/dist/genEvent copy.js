"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const baseUrl = 'http://localhost:8000/api/event';
async function sendEvents() {
    var _a;
    for (let i = 1; i <= 50; i++) {
        const payload = {
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
            const response = await axios_1.default.post(baseUrl, payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(`✔️ Event #${i} sent:`, response.status);
        }
        catch (error) {
            console.error(`❌ Failed to send event #${i}:`, ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        }
    }
}
sendEvents();
