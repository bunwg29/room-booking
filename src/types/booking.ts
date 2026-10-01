export type BookingStatus = 'CONFIRMED' | 'CANCELLED';

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  building: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export type TimeSlotState = 'AVAILABLE' | 'BOOKED' | 'SELECTED';
