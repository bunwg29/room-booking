import { useLocalSearchParams } from 'expo-router';
import BookingConfirmationScreen from '../../screens/BookingConfirmationScreen';

export default function BookingRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <BookingConfirmationScreen bookingId={id} />;
}
