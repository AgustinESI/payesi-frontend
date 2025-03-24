import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert/alert.service';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  constructor(
    private alertService: AlertService,
    private userService: UserService,
    private router: Router
  ) {}

  public user: User = {} as User;
  public password1: string = '';
  public password2: string = '';
  private token: string = '';

  ngOnInit(): void {}

  public registerUser(): void {
    if (this.password1 != this.password2) {
      this.alertService.showAlert('danger', 'Password does not match');
    }

    this.user.pwd = this.password1;

    this.userService.registerUser(this.token, this.user).subscribe({
      next: (res) => {
        this.alertService.showAlert(
          'primary',
          'User created, now you have to sign in'
        );
        this.router.navigate(['/login']);
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
