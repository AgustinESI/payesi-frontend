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

  public chargeFunds(
    token: string,
    amount: string,
    credit_card_number: string
  ): Observable<any> {
    const authHeaders = this.headers.append('Authorization', `Bearer ${token}`);

    alert('chargeFunds: ' + amount + ' ' + credit_card_number);

    var body = {
      amount: amount,
      credit_card_number: credit_card_number,
    };

    return this.httpClient.post(
      APP_CONSTANTS.API_BASE_URL + 'transactions/chargefunds',
      body,
      {
        headers: authHeaders,
      }
    );
  }

  public getPendingTransactions(token: string): Observable<any> {
    const authHeaders = this.headers.append('Authorization', `Bearer ${token}`);

    return this.httpClient.get(
      APP_CONSTANTS.API_BASE_URL + 'transactions/pending',
      {
        headers: authHeaders,
      }
    );
  }

  getTransactionById(token: string, request_id: string): Observable<any> {
    const authHeaders = this.headers.append('Authorization', `Bearer ${token}`);

    return this.httpClient.get(
      APP_CONSTANTS.API_BASE_URL + 'transactions/' + request_id,
      {
        headers: authHeaders,
      }
    );
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
    token: string
  ): Observable<any> {
    var body = {
      amount: requestAmount,
      sender_dni: dni,
      message: requestMessage,
    };

    const authHeaders = this.headers.append('Authorization', `Bearer ${token}`);

    return this.httpClient.post(
      APP_CONSTANTS.API_BASE_URL + 'transactions/createrequest',
      body,
      {
        headers: authHeaders,
      }
    );
  }

  public acceptTransaction(
    request_id: number,
    card_number: string,
    token: string
  ): Observable<any> {
    const authHeaders = this.headers.append('Authorization', `Bearer ${token}`);

    var body = {
      card_number: card_number,
    };

    return this.httpClient.post(
      APP_CONSTANTS.API_BASE_URL + 'transactions/acceptrequest/' + request_id,
      body,
      {
        headers: authHeaders,
      }
    );
  }

  public rejectTransaction(request_id: number, token: string): Observable<any> {
    const authHeaders = this.headers.append('Authorization', `Bearer ${token}`);

    return this.httpClient.post(
      APP_CONSTANTS.API_BASE_URL + 'transactions/rejectrequest/' + request_id,
      {},
      {
        headers: authHeaders,
      }
    );
  }
}
