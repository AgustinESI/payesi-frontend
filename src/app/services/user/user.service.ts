import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../../constants';
import { Observable } from 'rxjs';
import { User } from '../../models/user/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) {}

  public getMe(token: string): Observable<any> {
    const authHeaders = this.headers.set('Authorization', `Bearer ${token}`);

    return this.httpClient.get(APP_CONSTANTS.API_BASE_URL + 'users/me', {
      headers: authHeaders,
    });
  }

  public getUserbyDNI(token: string, dni: string): Observable<any> {
    const authHeaders = this.headers.set('Authorization', `Bearer ${token}`);

    return this.httpClient.get(APP_CONSTANTS.API_BASE_URL + 'users/' + dni, {
      headers: authHeaders,
    });
  }

  public updateUser(token: string, user: User): Observable<any> {
    const authHeaders = this.headers.set('Authorization', `Bearer ${token}`);

    const body = JSON.stringify(user);

    return this.httpClient.put(
      APP_CONSTANTS.API_BASE_URL + 'users/' + user.dni + '/update',
      body,
      {
        headers: authHeaders,
      }
    );
  }

  public registerUser(token: string, user: User): Observable<any> {
    const authHeaders = this.headers.set('Authorization', `Bearer ${token}`);

    const body = JSON.stringify(user);

    return this.httpClient.post(
      APP_CONSTANTS.API_BASE_URL + 'users/create',
      body,
      {
        headers: authHeaders,
      }
    );
  }

  public updateImageUser(token: string, base64String: string): Observable<any> {
    const authHeaders = this.headers.set('Authorization', `Bearer ${token}`);

    const body = {
      image: base64String,
    };

    return this.httpClient.put(
      APP_CONSTANTS.API_BASE_URL + 'users/image',
      body,
      {
        headers: authHeaders,
      }
    );
  }
}
