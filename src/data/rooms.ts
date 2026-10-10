import type { Room } from '../types/room';

const roomImages = [
  { uri: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80' },
  { uri: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80' },
  { uri: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80' },
  { uri: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80' },
  { uri: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80' },
  { uri: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80' },
];

export const rooms: Room[] = [
  { id: 'A-101', name: 'Study Room A-101', buildingCode: 'A', building: 'Tòa A', floor: 1, capacity: 4, status: 'Available', equipment: ['Whiteboard', 'AC'], image: roomImages[0] },
  { id: 'A-205', name: 'Computer Lab A-205', buildingCode: 'A', building: 'Tòa A', floor: 2, capacity: 20, status: 'Occupied', equipment: ['Projector', 'High-spec PC', 'AC'], image: roomImages[4] },
  { id: 'A-302', name: 'Focus Room A-302', buildingCode: 'A', building: 'Tòa A', floor: 3, capacity: 2, status: 'Available', equipment: ['Whiteboard', 'AC'], image: roomImages[2] },
  { id: 'B-103', name: 'Group Room B-103', buildingCode: 'B', building: 'Tòa B', floor: 1, capacity: 8, status: 'Available', equipment: ['Projector', 'Whiteboard', 'AC'], image: roomImages[3] },
  { id: 'B-204', name: 'Media Lab B-204', buildingCode: 'B', building: 'Tòa B', floor: 2, capacity: 16, status: 'Occupied', equipment: ['Projector', 'High-spec PC', 'AC'], image: roomImages[4] },
  { id: 'B-306', name: 'Seminar Room B-306', buildingCode: 'B', building: 'Tòa B', floor: 3, capacity: 12, status: 'Available', equipment: ['Projector', 'Whiteboard'], image: roomImages[5] },
  { id: 'C-102', name: 'Quiet Room C-102', buildingCode: 'C', building: 'Tòa C', floor: 1, capacity: 6, status: 'Available', equipment: ['Whiteboard', 'AC'], image: roomImages[1] },
  { id: 'C-208', name: 'Data Lab C-208', buildingCode: 'C', building: 'Tòa C', floor: 2, capacity: 20, status: 'Available', equipment: ['Projector', 'High-spec PC', 'AC'], image: roomImages[4] },
  { id: 'C-310', name: 'Discussion C-310', buildingCode: 'C', building: 'Tòa C', floor: 3, capacity: 10, status: 'Occupied', equipment: ['Whiteboard'], image: roomImages[3] },
  { id: 'V-101', name: 'Library Pod V-101', buildingCode: 'V', building: 'Tòa V', floor: 1, capacity: 2, status: 'Available', equipment: ['AC'], image: roomImages[1] },
  { id: 'V-202', name: 'Innovation Hub V-202', buildingCode: 'V', building: 'Tòa V', floor: 2, capacity: 14, status: 'Available', equipment: ['Projector', 'Whiteboard', 'High-spec PC', 'AC'], image: roomImages[0] },
  { id: 'V-305', name: 'Project Room V-305', buildingCode: 'V', building: 'Tòa V', floor: 3, capacity: 8, status: 'Available', equipment: ['Projector', 'Whiteboard', 'AC'], image: roomImages[2] },
];
