import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../../constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private httpClient: HttpClient) {}

  public authenticate(email: string, password: string): Observable<any> {
    const body = {
      email: email,
      password: password,
    };

    return this.httpClient.post(
      APP_CONSTANTS.API_BASE_URL + 'auth/authenticate',
      body,
      { headers: this.headers }
    );
  }

  public getToken(): any {
    let response = localStorage.getItem(APP_CONSTANTS.STORAGE_SESSION_NAME);
    if (!response) {
      response = 'false';
    }

    if (response === 'true') {
      return localStorage.getItem(APP_CONSTANTS.STORAGE_TOKEN_NAME);
    } else {
      return sessionStorage.getItem(APP_CONSTANTS.STORAGE_TOKEN_NAME);
    }
  }
}
