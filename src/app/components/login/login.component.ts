import { Component } from '@angular/core';
import { AuthService } from '../../services/authentication/auth.service';
import { APP_CONSTANTS } from '../../constants';
import { AlertService } from '../../services/alert/alert.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private userService: UserService,
    private router: Router
  ) {}

  //public email: string = 'agustin@payesi.com';
  //public password: string = '5555';
  public email: string = 'john.doe@example.com';
  public password: string = 'securepassword123';
  public saveSession: boolean = false;

  authenticateUser() {
    this.authService.authenticate(this.email, this.password).subscribe({
      next: (res) => {
        if (res) {
          const token = res.token;

          this.authService.storeToken(token, this.saveSession);

          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('Authentication error:', err);

        const errorMessage = this.alertService.handleError(err);

        this.alertService.showAlert(
          'danger',
          'Authentication failed: ' + errorMessage
        );
      },
    });
  }
}
