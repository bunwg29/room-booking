import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  BrowseRooms: undefined;
  MyBookings: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  RoomDetails: { roomId: string; roomName: string };
  BookingConfirmation: { bookingId: string };
};
