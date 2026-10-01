import { useQuery } from '@tanstack/react-query';
import { roomService } from '../services/roomDataSource';

export const roomsQueryKey = ['rooms'] as const;

export function useRooms() {
  return useQuery({ queryKey: roomsQueryKey, queryFn: roomService.getRooms });
}
