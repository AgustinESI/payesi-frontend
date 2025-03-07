import { CreditCard } from '../credit-card/credit-card';
import { Friend } from './friend';

export interface User {
  dni: string;
  name: string;
  email: string;
  birthDate: string;
  active: boolean;
  image: string;
  creditCards: CreditCard[];
  friends: Friend[];
}
