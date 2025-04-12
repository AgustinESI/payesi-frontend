import { CreditCard } from '../credit-card/credit-card';
import { Friend } from './friend';

export interface User {
  dni: string;
  name: string;
  email: string;
  amount: BigInt;
  phone: string;
  pwd: string;
  administrator: boolean;
  address: string;
  birth_date: string;
  active: boolean;
  image: string;
  credit_cards: CreditCard[];
  friends: Friend[];
  blocked_users: Friend[];
  favourite_users: Friend[];
}
