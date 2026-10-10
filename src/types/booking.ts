export type BookingStatus = 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED';

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  building: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  passCode: string;
  reminderId?: string;
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export type TimeSlotState = 'AVAILABLE' | 'BOOKED' | 'SELECTED';
