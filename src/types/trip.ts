export interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  registrationNumber: string;
  description: string;
  images: string | null;
  category: string;
}

export interface Trip {
  id: string;
  departure: string;
  arrival: string;
  departureDate: string;
  departureTime: string;
  seatsAvailable: number;
  driverName: string;
  rating?: number;
  driverProfilePicture: string | null;
  price: number;
  status: string;
  createdById: string;
  createdAt: string;
  tripType: "covoiturage" | "agence";
  vehicle: Vehicle;
}

export interface TripTypeSelectorProps {
  selected: string | null;
  onChange: (value: string | null) => void;
  counts: {
    total: number;
    agence: number;
    covoiturage: number;
  };
}
