import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertSubject = new BehaviorSubject<{
    type: 'success' | 'danger' | 'warning' | 'primary';
    message: string;
  } | null>(null);

  public alert$ = this.alertSubject.asObservable();

  constructor(private router: Router) {}

  public showAlert(
    type: 'success' | 'danger' | 'warning' | 'primary',
    message: string
  ) {
    this.alertSubject.next({ type, message });

    setTimeout(() => {
      this.alertSubject.next(null);
    }, 5000);
  }

  public showAutoAlertError(err: any) {
    let errorMessage =
      'An error has occurred, Please try again later. If the error persists contact your service administrator.';

    let type: 'success' | 'danger' | 'warning' | 'primary' = 'danger';

    if (err && err.error && err.error.statusCode) {
      errorMessage = err.message;

      switch (err.error.statusCode) {
        case 401:
          this.router.navigate(['/login']);
          break;
        case 403:
          type = 'danger';
          break;
        case 404:
        case 400:
          type = 'warning';
          break;
      }
    } else if (err && err.error && err.error.message) {
      errorMessage = err.error.message;
    } else if (err && err.message) {
      errorMessage = err.message;
    }

    this.showAlert(type, errorMessage);
  }

  public handleError(err: any): string {
    let errorMessage =
      'An error has occurred, Please try again later. If the error persists contact your service administrator.';
    if (err && err.error && err.error.message) {
      errorMessage = err.error.message;
    } else if (err && err.message) {
      errorMessage = err.message;
    }

    return errorMessage;
  }
}
