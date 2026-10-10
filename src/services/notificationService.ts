import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { bookingStartDate } from './bookingService';
import type { Booking } from '../types/booking';

const channelId = 'booking-reminders';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

async function requestNotificationPermission() {
  if (Platform.OS === 'web') return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(channelId, {
      name: 'Nhắc lịch đặt phòng',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#1D4ED8',
    });
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleBookingReminder(booking: Booking) {
  const allowed = await requestNotificationPermission();
  if (!allowed) return undefined;

  const triggerDate = bookingStartDate(booking.date, booking.startTime);
  triggerDate.setMinutes(triggerDate.getMinutes() - 15);
  if (triggerDate.getTime() <= Date.now()) return undefined;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Sắp đến giờ check-in',
      body: `${booking.roomName} bắt đầu lúc ${booking.startTime}. Còn 15 phút để check-in.`,
      data: { url: `/booking/${booking.id}`, bookingId: booking.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: Platform.OS === 'android' ? channelId : undefined,
    },
  });
}

export async function cancelBookingReminder(identifier?: string) {
  if (!identifier || Platform.OS === 'web') return;
  await Notifications.cancelScheduledNotificationAsync(identifier);
}
