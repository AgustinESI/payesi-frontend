import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../../constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) {}

  public getMe(token: string): Observable<any> {
    const authHeaders = this.headers.append('Authorization', `Bearer ${token}`);

    return this.httpClient.get(APP_CONSTANTS.API_BASE_URL + 'users/me', {
      headers: authHeaders,
    });
  }
}
