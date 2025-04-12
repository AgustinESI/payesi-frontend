import { EnumTransactionType } from '../enumtransactiontype';

export interface Transaction {
  id: number;
  amount: bigint;
  message: string;
  date: string;
  status: 'PENDING' | 'COMPLETED';
  transaction_type: string;
  sender_name: string;
  sender_dni: string;
  receiver_name: string;
}
