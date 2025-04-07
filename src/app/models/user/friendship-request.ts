import { User } from './user';

// friendship-request.ts
export interface FriendshipRequest {
  id: number;
  sender_dni: string;
  receiver_dni: string;
  status: string;
  created_at: string;
  responded_at: string | null;
  sender: User;
  receiver: User;
}
