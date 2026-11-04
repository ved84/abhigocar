import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { Vehicle, Booking } from "@/types";
import { store } from "./store";

// Collection names
const VEHICLES_COLLECTION = "vehicles";
const BOOKINGS_COLLECTION = "bookings";

// Get vehicles from Firestore if configured, else from local store
export async function getVehiclesData(): Promise<Vehicle[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, VEHICLES_COLLECTION));
      if (!snap.empty) {
        const firestoreVehicles = snap.docs.map((d) => d.data() as Vehicle);
        // Use replaceVehicles so deleted cars in Firestore are immediately removed from store
        store.replaceVehicles(firestoreVehicles);
        return store.getVehicles({ onlyActive: false });
      } else {
        return store.getVehicles({ onlyActive: false });
      }
    } catch (error) {
      console.warn("Firestore read failed, falling back to local dataset:", error);
    }
  }
  return store.getVehicles({ onlyActive: false });
}

// Save or update a vehicle in Firestore
export async function saveVehicleToFirestore(vehicle: Vehicle): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, VEHICLES_COLLECTION, vehicle.id), vehicle);
    } catch (error) {
      console.warn("Firestore write failed:", error);
    }
  }
}

// Delete a vehicle from Firestore and store
export async function deleteVehicleFromFirestore(vehicleId: string): Promise<void> {
  // Guarantee removal from memory store immediately
  store.deleteVehicle(vehicleId);

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, VEHICLES_COLLECTION, vehicleId));
      const snap = await getDocs(collection(db, VEHICLES_COLLECTION));
      for (const d of snap.docs) {
        const data = d.data() as Vehicle;
        if (data.id === vehicleId || data.slug === vehicleId) {
          await deleteDoc(d.ref).catch(() => {});
        }
      }
    } catch (error) {
      console.warn("Firestore delete failed:", error);
    }
  }
}

// Save a booking in Firestore
export async function saveBookingToFirestore(booking: Booking): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, BOOKINGS_COLLECTION, booking.id), booking);
    } catch (error) {
      console.warn("Firestore booking write failed:", error);
    }
  }
}

// Get bookings from Firestore if configured
export async function getBookingsData(): Promise<Booking[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, BOOKINGS_COLLECTION), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as Booking);
      }
    } catch (error) {
      console.warn("Firestore bookings read failed:", error);
    }
  }
  return store.getBookings();
}
