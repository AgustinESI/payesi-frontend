import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../../constants';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

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

  private hasToken(): boolean {
    return !!this.getToken();
  }

  public storeToken(token: string, store: boolean): void {
    if (store) {
      localStorage.setItem(APP_CONSTANTS.STORAGE_TOKEN_NAME, token);
    } else {
      sessionStorage.setItem(APP_CONSTANTS.STORAGE_TOKEN_NAME, token);
    }
    localStorage.setItem(
      APP_CONSTANTS.STORAGE_SESSION_NAME,
      String(this.storeToken)
    );

    this.isLoggedInSubject.next(true);
  }

  public logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.isLoggedInSubject.next(false);
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
