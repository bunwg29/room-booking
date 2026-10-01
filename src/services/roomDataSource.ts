import { rooms } from '../data/rooms';
import type { Room } from '../types/room';

export interface RoomDataSource {
  getRooms(): Promise<Room[]>;
  getRoomById(roomId: string): Room | undefined;
}

export const roomService: RoomDataSource = {
  getRooms: async () => rooms.map((room) => ({ ...room })),
  getRoomById: (roomId) => rooms.find((room) => room.id === roomId),
};

export const mockRoomDataSource = roomService;
