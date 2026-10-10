import type { Booking, TimeSlot } from '../types/booking';

export const timeSlots: TimeSlot[] = [
  { id: '07:30-09:30', startTime: '07:30', endTime: '09:30' },
  { id: '09:30-11:30', startTime: '09:30', endTime: '11:30' },
  { id: '13:00-15:00', startTime: '13:00', endTime: '15:00' },
  { id: '15:00-17:00', startTime: '15:00', endTime: '17:00' },
];

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const bookingsConflict = (candidate: Booking, existing: Booking) =>
  candidate.roomId === existing.roomId &&
  candidate.date === existing.date &&
  existing.status !== 'CANCELLED' &&
  toMinutes(candidate.startTime) < toMinutes(existing.endTime) &&
  toMinutes(candidate.endTime) > toMinutes(existing.startTime);

export const hasBookingConflict = (candidate: Booking, bookings: Booking[]) =>
  bookings.some((booking) => bookingsConflict(candidate, booking));

export const isSlotOccupied = (
  roomId: string,
  date: string,
  slot: TimeSlot,
  bookings: Booking[],
) =>
  bookings.some(
    (booking) =>
      booking.roomId === roomId &&
      booking.date === date &&
      booking.status !== 'CANCELLED' &&
      toMinutes(slot.startTime) < toMinutes(booking.endTime) &&
      toMinutes(slot.endTime) > toMinutes(booking.startTime),
  );

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateLabel = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.toLocaleDateString('vi-VN', { weekday: 'short', month: 'short', day: 'numeric' });
};

export const formatCompactDate = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`);
  return {
    weekday: parsed.toLocaleDateString('vi-VN', { weekday: 'short' }).toUpperCase(),
    day: parsed.getDate(),
  };
};

export const bookingStartDate = (date: string, startTime: string) =>
  new Date(`${date}T${startTime}:00`);

export const createBookingPass = (roomId: string) => {
  const stamp = Date.now().toString(36).toUpperCase();
  const nonce = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `VKU-${roomId}-${stamp}-${nonce}`;
};

export const createBookingId = () => `booking-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const getCurrentSlot = (now = new Date()) => {
  const minutes = now.getHours() * 60 + now.getMinutes();
  return timeSlots.find(
    (slot) => minutes >= toMinutes(slot.startTime) && minutes < toMinutes(slot.endTime),
  );
};

export const isRoomOccupiedNow = (
  roomId: string,
  baseOccupied: boolean,
  bookings: Booking[],
  now = new Date(),
) => {
  if (baseOccupied) return true;
  const slot = getCurrentSlot(now);
  return slot ? isSlotOccupied(roomId, formatDate(now), slot, bookings) : false;
};
