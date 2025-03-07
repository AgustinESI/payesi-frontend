import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../../../services/alert/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class AlertComponent implements OnInit, OnDestroy {
  public message: string = '';
  public type: 'success' | 'danger' | 'warning' | 'primary' = 'primary';
  public showAlert: boolean = false;
  public fadeOut: boolean = false;
  private alertSubscription: Subscription | null = null;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertSubscription = this.alertService.alert$.subscribe((alert) => {
      if (alert) {
        this.message = alert.message;
        this.type = alert.type;
        this.showAlert = true;
        this.fadeOut = false;

        setTimeout(() => {
          this.fadeOut = true;
          setTimeout(() => {
            this.showAlert = false;
          }, 500);
        }, 4500);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }
  }

  public getIcon(): string {
    switch (this.type) {
      case 'success':
        return 'bi bi-check-circle';
      case 'danger':
        return 'bi bi-exclamation-triangle';
      case 'warning':
        return 'bi bi-exclamation-circle';
      case 'primary':
        return 'bi bi-info-circle';
      default:
        return 'bi bi-question-circle';
    }
  }
}
