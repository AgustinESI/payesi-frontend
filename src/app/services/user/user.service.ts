import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../../constants';
import { Observable } from 'rxjs';
import { User } from '../../models/user/user';
import { FriendshipRequest } from '../../models/user/friendship-request';

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

  public getUsers(token: string): Observable<any> {
    const authHeaders = this.headers.set('Authorization', `Bearer ${token}`);

    return this.httpClient.get(APP_CONSTANTS.API_BASE_URL + 'users/all', {
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

  public activateUser(token: string, dni: string) {
    const authHeaders = this.headers.set('Authorization', `Bearer ${token}`);
    console.log(authHeaders);
    return this.httpClient.get(
      APP_CONSTANTS.API_BASE_URL + 'users/' + dni + '/active',
      {
        headers: authHeaders,
      }
    );
  }

  public deleteUser(token: string, dni: string) {
    const authHeaders = this.headers.set('Authorization', `Bearer ${token}`);

    return this.httpClient.delete(
      APP_CONSTANTS.API_BASE_URL + 'users/' + dni + '/delete',
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

  public createFriendshipRequest(
    token: string,
    friend: string
  ): Observable<any> {
    const authHeaders = this.headers.set('Authorization', `Bearer ${token}`);

    const body = {
      friend_dni: friend,
    };

    return this.httpClient.post(
      APP_CONSTANTS.API_BASE_URL + 'friendship/new',
      body,
      {
        headers: authHeaders,
      }
    );
  }

  public getPendingFriendshipRequests(
    token: string
  ): Observable<FriendshipRequest[]> {
    const authHeaders = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token}`
    );

    return this.httpClient.get<FriendshipRequest[]>(
      `${APP_CONSTANTS.API_BASE_URL}friendship/pending`,
      { headers: authHeaders }
    );
  }

  acceptFriendshipRequest(token: string, requestId: number): Observable<any> {
    const authHeaders = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token}`
    );
    return this.httpClient.post<FriendshipRequest[]>(
      `${APP_CONSTANTS.API_BASE_URL}friendship/accept/` + requestId,
      {},
      { headers: authHeaders }
    );
  }

  declineFriendshipRequest(token: string, requestId: number): Observable<any> {
    const authHeaders = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token}`
    );
    return this.httpClient.post<FriendshipRequest[]>(
      `${APP_CONSTANTS.API_BASE_URL}friendship/reject/` + requestId,
      {},
      { headers: authHeaders }
    );
  }

  deleteFriend(token: string, friendDni: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.delete<any>(
      `${APP_CONSTANTS.API_BASE_URL}friendship/delete/${friendDni}`,
      { headers }
    );
  }
}
