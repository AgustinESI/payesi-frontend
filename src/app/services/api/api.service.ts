import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONSTANTS } from '../../constants';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) {}

  public requestApiKey(token:string, applicationName: string): Observable<any> {
    const authHeaders = this.headers.set('Authorization', `Bearer ${token}`);

    const body = JSON.stringify({ application_name: applicationName });

    return this.httpClient.post(
      APP_CONSTANTS.API_BASE_URL + 'api/requestkey',
      body,
      {
        headers: authHeaders,
      }
    );
  }

  public getApiKeys(token:string): Observable<any[]> {
    const authHeaders = this.headers.set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<any[]>(
      APP_CONSTANTS.API_BASE_URL + 'api/getkeys',
      { 
        headers: authHeaders 
      }
    );
  }

  public updateApiKey(token:string, apiKeyId: string): Observable<any> {
    const authHeaders = this.headers.set('Authorization', `Bearer ${token}`);
    return this.httpClient.put(
      APP_CONSTANTS.API_BASE_URL + 'api/updatekey',
      JSON.stringify({ api_key_id: apiKeyId }),
      {
        headers: authHeaders
      }
    );

  }

  public deleteApiKey(token:string, apiKeyId: string): Observable<any> {
    const authHeaders = this.headers.set('Authorization', `Bearer ${token}`);
    return this.httpClient.delete(
      APP_CONSTANTS.API_BASE_URL + 'api/deletekey/'
      + apiKeyId,
      {
        headers: authHeaders
      }
    );
  }
}