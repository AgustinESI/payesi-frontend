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

    return this.httpClient.get(
      APP_CONSTANTS.API_BASE_URL + 'credit-card/transaction',
      {
        headers: authHeaders,
      }
    );
  }

  requestMoney(
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
