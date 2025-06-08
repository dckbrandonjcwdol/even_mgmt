"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

// interface TicketType {
//   id: string;
//   name: string;
//   price: number;
// }

interface Event {
  id: string;
  title: string;
  description: string;
  location?: {
    name: string;
  };
}

interface TicketType {
  id: string;
  name: string;
  price: number;
}

export default function FormBuyTicket({ id }: { id: string }) {
  
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [ticketTypeId, setTicketTypeId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [point, setPoint] = useState<number | null>(null); // ✅

  
  // const {points } = session?.user || {};

  useEffect(() => {
    
    if (!session?.user?.id) return; // ✅ Pastikan session ada di dalam efek
    
    const fetchPoint = async () => {


      const payload = {
        userId: Number(session.user.id),
      };

      console.log("User ID yang dikirim:", payload.userId);

      try {
        const response = await axios.post("/points", payload, {
          headers: { "Content-Type": "application/json" },
        });

        console.log("✅ Points response:", response.data._sum.points);
        setPoint(response.data._sum.points);
      } catch (err) {
        console.error("❌ Failed to load points:", err);
      }
    };

    fetchPoint();
  }, [session]); // dependensi session agar effect dipanggil ulang ketika login

  // Debug print id ke console setiap kali id berubah
  useEffect(() => {
    console.log("Debug: FormBuyTicket received id =", id);
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/event/${id}`);
        if (res.data) setEvent(res.data);
        else setError("Data event kosong.");
      } catch {
        setError("Gagal mengambil data event.");
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchTicketType = async () => {
      try {
        const res = await axios.get(`/ticket-type/${id}`);
        console.log("Debug: response ticket-type:", res);  // <-- debug di sini
        if (res.data && Array.isArray(res.data)) {
          setTicketTypes(res.data);
          setTicketTypeId(res.data[0]?.id || "");
        } else {
          console.warn("Debug: ticket-type data tidak berupa array atau kosong", res.data);
        }
      } catch (error) {
        console.error("Debug: gagal fetch ticket-type", error);
        setError("Gagal mengambil data TicketType.");
      }
    };

    fetchTicketType();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🧪 Form submitted");
    setLoading(true);
    setError("");

    if (!session || !session.user?.id) {
      setError("Anda belum login.");
      setLoading(false);
      return;
    }

    const payload = {
      customerId: session.user.id,
      eventId: id,
      ticketTypeId: ticketTypeId, 
      quantity: 1,
    };

    try {
      const response = await axios.post("/buy-ticket", payload, {
        headers: { "Content-Type": "application/json" },
      });
     
      try {
        console.log("✅ Response dari backend:", response.data);

        const registrationId = response.data?.registrationId ?? "tidak-ada";
        const finalPrice = response.data?.finalPrice ?? 0;
        const usedPoints = response.data?.usedPoints ?? 0;

        console.log("finalPrice type:", typeof finalPrice, "value:", finalPrice);
        console.log("usedPoints type:", typeof usedPoints, "value:", usedPoints);

        const query = new URLSearchParams({
          registrationId,
          finalPrice: finalPrice.toString(),
          usedPoints: usedPoints.toString(),
        });

        console.log("🚀 Navigating to:", `/confirmation/${registrationId}?${query.toString()}`);

        router.push(`/confirmation/${registrationId}?${query.toString()}`);

      } catch (error) {
        console.error("Error saat memproses response:", error);
      }

    } catch (err: unknown) {
      if (isAxiosError(err)) {
        console.error("❌ Axios Error:", err.response?.data);
        setError(err.response?.data?.message || "Terjadi kesalahan.");
      } else {
        console.error("❌ Unknown Error:", err);
        setError("Gagal menghubungi server.");
      }
    }

    setLoading(false);
  };

  if (status === "loading") return <p className="text-center mt-10">Loading session...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!event) return <p className="text-center mt-10">Loading event...</p>;

  return (
    <>
      {/* Debug info: tampilkan id */}
      {/* <p className="text-center mb-4 text-sm text-gray-500">Debug: id = {id}</p> */}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-xl font-semibold text-center">Buy Ticket</h2>

        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-4">
          <h2 className="text-2xl font-bold text-blue-800">{event.title}</h2>
          <p>{event.description}</p>
          <p>
            <strong>Location:</strong> {event.location?.name}
          </p>
        </div>

        <div>
          <label htmlFor="ticketType" className="block font-medium text-sm">
            Ticket Type
          </label>
          <select
            id="ticketType"
            value={ticketTypeId}
            onChange={(e) => setTicketTypeId(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            required
          >
            <option value="">Pilih tiket</option>
            {/* {ticketTypes.map((ticket: any) => (
              <option key={ticket.id} value={ticket.id}>
                {ticket.name} - Rp {ticket.price?.toLocaleString("id-ID")}
              </option>
            ))} */}
            {ticketTypes.map((ticket) => (
              <option key={ticket.id} value={ticket.id}>
                {ticket.name} - Rp {ticket.price.toLocaleString("id-ID")}
              </option>
            ))}

          </select>
        </div>

        {/* <div>
          <label htmlFor="quantity" className="block font-medium text-sm">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </div> */}

          <div>
            Your points: {(Number(point ?? 0) || 0).toLocaleString('id-ID')}
          </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          {loading ? "Processing..." : "Buy Ticket"}
        </button>
      </form>
    </>
  );
}
