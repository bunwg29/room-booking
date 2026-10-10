import type { ImageSourcePropType } from 'react-native';

export type RoomStatus = 'Available' | 'Occupied';
export type BuildingCode = 'A' | 'B' | 'C' | 'V';
export type RoomEquipment = 'Projector' | 'Whiteboard' | 'High-spec PC' | 'AC';

export interface Room {
  id: string;
  name: string;
  buildingCode: BuildingCode;
  building: string;
  floor: number;
  capacity: number;
  equipment: RoomEquipment[];
  status: RoomStatus;
  image: ImageSourcePropType; // require() is compatible with ImageSourcePropType
}
