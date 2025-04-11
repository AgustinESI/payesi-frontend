import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONSTANTS } from '../../constants';
import { CreditCard } from '../../models/credit-card/credit-card';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private httpClient: HttpClient) {}

  public getTransactions(token: string): Observable<any> {
    const authHeaders = this.headers.append('Authorization', `Bearer ${token}`);

    return this.httpClient.get(APP_CONSTANTS.API_BASE_URL + 'transactions/me', {
      headers: authHeaders,
    });
  }

  public sendMoney(
    token: string,
    amount: string,
    message: string,
    receiver: string,
    credit_card_number: string
  ): Observable<any> {
    const authHeaders = this.headers.append('Authorization', `Bearer ${token}`);

    var body = {
      message: message,
      amount: amount,
      receiver_dni: receiver,
      transaction_type: 'SEND',
      credit_card_number: credit_card_number,
    };

    return this.httpClient.post(
      APP_CONSTANTS.API_BASE_URL + 'transactions/create',
      body,
      {
        headers: authHeaders,
      }
    );
  }

  public requestMoney(
    requestAmount: number,
    dni: string,
    requestMessage: string,
    requestCreditCard: CreditCard,
    token: string
  ): Observable<any> {
    var body = {
      cardNumber: requestCreditCard,
      amount: requestAmount,
      dni: dni,
      message: requestMessage,
    };

    const authHeaders = this.headers.append('Authorization', `Bearer ${token}`);

    return this.httpClient.post(
      APP_CONSTANTS.API_BASE_URL + 'credit-card/transaction',
      body,
      {
        headers: authHeaders,
      }
    );
  }
}
