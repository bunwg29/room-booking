import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { hasBookingConflict } from '../services/bookingService';
import type { Booking } from '../types/booking';

export type AddBookingResult = { success: true } | { success: false; message: string };

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => AddBookingResult;
  cancelBooking: (bookingId: string) => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      addBooking: (booking) => {
        if (hasBookingConflict(booking, get().bookings)) {
          return { success: false, message: 'Khung giờ này đã được đặt.' };
        }
        set((state) => ({ bookings: [...state.bookings, booking] }));
        return { success: true };
      },
      cancelBooking: (bookingId) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId ? { ...booking, status: 'CANCELLED' } : booking,
          ),
        })),
    }),
    {
      name: 'vku-booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ bookings: state.bookings }),
    },
  ),
);
