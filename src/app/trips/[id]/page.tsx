import { notFound } from "next/navigation";
import { Trip } from "@/types/trip";
import TripDetails from "@/components/TripDetails";

async function getTripById(id: string): Promise<Trip | null> {
  const res = await fetch(`http://localhost:3001/safego/trips/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return await res.json();
}

export default async function TripDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const trip = await getTripById(id);
  if (!trip) return notFound();

  return <TripDetails trip={trip} />;
}
