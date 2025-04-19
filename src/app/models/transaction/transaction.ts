import { EnumTransactionType } from '../enumtransactiontype';

export interface Transaction {
  id: number;
  amount: bigint;
  message: string;
  date: string;
  responded_at: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  transaction_type: string;
  sender_dni: string;
  receiver_dni: string;
  receiver_name: string;
  sender_name: string;
}
