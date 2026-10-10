import { router } from 'expo-router';
import RoomListScreen from './RoomListScreen';

export default function BrowseRoomsScreen() {
  return (
    <RoomListScreen
      onRoomPress={(room) => router.push({ pathname: '/room/[id]', params: { id: room.id } })}
    />
  );
}
