import { EnumTransactionType } from '../enumtransactiontype';

export interface Transaction {
  id: number;
  amount: bigint;
  transactionType: EnumTransactionType;
  message: string;
  date: string;
  status: 'PENDING' | 'COMPLETED';
  transaction_type: string;
  sender_name: string;
  receiver_name: string;
}
