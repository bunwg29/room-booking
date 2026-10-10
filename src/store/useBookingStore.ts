import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { hasBookingConflict } from '../services/bookingService';
import { cancelBookingReminder, scheduleBookingReminder } from '../services/notificationService';
import type { Booking } from '../types/booking';

export type AddBookingResult =
  | { success: true; reminderScheduled: boolean }
  | { success: false; message: string };

interface UserSession {
  id: string;
  name: string;
  studentId: string;
  email: string;
}

interface BookingState {
  bookings: Booking[];
  session: UserSession;
  addBooking: (booking: Booking) => Promise<AddBookingResult>;
  cancelBooking: (bookingId: string) => Promise<void>;
  checkInBooking: (bookingId: string) => Promise<void>;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      session: {
        id: '23IT.B015',
        name: 'Tran Ka Bun',
        studentId: '23IT.B015',
        email: 'buntk.23itb@vku.udn.vn',
      },
      addBooking: async (booking) => {
        if (hasBookingConflict(booking, get().bookings)) {
          return { success: false, message: 'Khung giờ này đã được đặt.' };
        }
        let reminderId: string | undefined;
        try {
          reminderId = await scheduleBookingReminder(booking);
        } catch {
          // Booking remains valid if notifications are unavailable.
        }
        set((state) => ({ bookings: [...state.bookings, { ...booking, reminderId }] }));
        return { success: true, reminderScheduled: Boolean(reminderId) };
      },
      cancelBooking: async (bookingId) => {
        const booking = get().bookings.find((item) => item.id === bookingId);
        if (!booking || booking.status !== 'CONFIRMED') return;
        await cancelBookingReminder(booking?.reminderId).catch(() => undefined);
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId ? { ...booking, status: 'CANCELLED' } : booking,
          ),
        }));
      },
      checkInBooking: async (bookingId) => {
        const booking = get().bookings.find((item) => item.id === bookingId);
        if (!booking || booking.status !== 'CONFIRMED') return;
        await cancelBookingReminder(booking?.reminderId).catch(() => undefined);
        set((state) => ({
          bookings: state.bookings.map((item) =>
            item.id === bookingId ? { ...item, status: 'CHECKED_IN' } : item,
          ),
        }));
      },
    }),
    {
      name: 'vku-booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ bookings: state.bookings, session: state.session }),
    },
  ),
);
