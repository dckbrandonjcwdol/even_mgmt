import axios from "./axios";

export const getEventsByOrganizer = async (organizerId: number) => {
  try {
    console.log("organizerId:", organizerId);

    const response = await axios.post('/dashboard/events', {
      organizerId,
    });

    console.log("Response data:", response.data);

    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch events:', error?.response?.data || error.message);
    throw new Error('Failed to fetch events');
  }
};
