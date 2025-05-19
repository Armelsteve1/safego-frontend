import { notFound } from "next/navigation";
import { Trip } from "@/types/trip";
import TripDetails from "@/components/TripDetails";
import { apiFetchServer } from "@/lib/apiServer";

async function getTripById(id: string): Promise<Trip | null> {
  return await apiFetchServer(`/trips/${id}`, {
    next: { revalidate: 60 },
  });
}
export default async function TripDetailPage({ params }: { params: { id: string } }) {
  const trip = await getTripById(params.id);
  if (!trip) return notFound();

  return <TripDetails trip={trip} />;
}
