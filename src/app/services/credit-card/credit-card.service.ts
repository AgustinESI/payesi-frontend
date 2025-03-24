import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APP_CONSTANTS } from '../../constants';
import { Observable } from 'rxjs';
import { User } from '../../models/user/user';
import { CreditCard } from '../../models/credit-card/credit-card';

@Injectable({
  providedIn: 'root',
})
export class CreditCardService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) {}

  public addCreditCard(token: string, creditCard: CreditCard): Observable<any> {
    const authHeaders = this.headers.set('Authorization', `Bearer ${token}`);

    const body = JSON.stringify(creditCard);

    console.log(body);

    return this.httpClient.post(
      APP_CONSTANTS.API_BASE_URL + 'credit_cards/card',
      body,
      {
        headers: authHeaders,
      }
    );
  }

  deleteCreditCard(token: string, number: string): Observable<any> {
    const authHeaders = this.headers.set('Authorization', `Bearer ${token}`);

    return this.httpClient.delete(
      APP_CONSTANTS.API_BASE_URL + 'credit_cards/card' + number,
      {
        headers: authHeaders,
      }
    );
  }
}
