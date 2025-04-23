import { Component } from '@angular/core';
import { AlertService } from '../../services/alert/alert.service';
import { ApiService } from '../../services/api/api.service';
import { AuthService } from '../../services/authentication/auth.service';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user/user';
declare var bootstrap: any;

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.css'],
})
export class ApiComponent {
  public applicationName: string = '';
  public apiKey: any;
  public isLoading: boolean = false;
  private token: string = '';
  public user: User = {} as User;
  public apiKeys: any[] = []; // Array to store existing API keys

  constructor(
    private apiKeyService: ApiService,
    private alertService: AlertService,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.token = this.authService.getToken();

    if (this.token) {
      var userDNI = this.route.snapshot.paramMap.get('id') || '';
      this.getMe();
      this.loadApiKeys();
    } else {
      this.router.navigate(['/login']);
    }
  }

  private getMe() {
    this.userService.getMe(this.token).subscribe({
      next: (res) => {
        if (res) {
          this.user = res;
        }
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
      },
    });
  }

  public requestApiKey(): void {
    this.isLoading = true;
    this.apiKeyService.requestApiKey(this.token, this.applicationName).subscribe({
      next: (response) => {
        this.apiKey = response.api_key;
        this.loadApiKeys() // Add the new API key to the list
        this.isLoading = false;

        // Open the modal
        const modalElement = document.getElementById('apiKeyModal');
        if (modalElement) {
          const modalInstance = new bootstrap.Modal(modalElement);
          modalInstance.show();
        }
      },
      error: (err) => {
        this.alertService.showAlert('danger', 'Failed to generate API key');
        this.isLoading = false;
      },
    });
  }
  private loadApiKeys(): void {
    this.apiKeyService.getApiKeys(this.token).subscribe({
      next: (response) => {
        this.apiKeys = response;
      },
      error: (err) => {
        this.alertService.showAlert('danger', 'Failed to load API keys');
      },
    });
  }

  public updateApiKey(apiKey: string): void {
    this.isLoading = true;
    this.apiKeyService.updateApiKey(this.token, apiKey).subscribe({
      next: (response) => {
        this.alertService.showAlert('success', 'API key updated successfully');
        this.apiKey = response.api_key // Refresh the list of API keys
        this.isLoading = false;

        const modalElement = document.getElementById('apiKeyModal');
        if (modalElement) {
          const modalInstance = new bootstrap.Modal(modalElement);
          modalInstance.show();
        }
      },
      error: (err) => {
        this.alertService.showAlert('danger', 'Failed to update API key');
        this.isLoading = false;
      },
    });
  }

  public deleteApiKey(apiKey: string): void {
    this.isLoading = true;
    this.apiKeyService.deleteApiKey(this.token, apiKey).subscribe({
      next: (response) => {
        this.alertService.showAlert('success', 'API key deleted successfully');
        this.loadApiKeys(); // Refresh the list of API keys
        this.isLoading = false;
      },
      error: (err) => {
        this.alertService.showAlert('danger', 'Failed to delete API key');
        this.isLoading = false;
      },
    });
  }
}