import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AlertService } from '../../services/alert/alert.service';
import { AuthService } from '../../services/authentication/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user/user';
import { CreditCardService } from '../../services/credit-card/credit-card.service';
import { CreditCard } from '../../models/credit-card/credit-card';
import { APP_CONSTANTS } from '../../constants';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private authService: AuthService,
    private creditCardService: CreditCardService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  private token: string = '';
  public users: User[] = [] as User[];
  public creditCards: CreditCard[] = [] as CreditCard[];
  public user: User = {} as User;

  ngOnInit(): void {
    this.token = this.authService.getToken();

    if (this.token) {
      this.getMe(this.token);
    } else {
      this.alertService.showAlert('danger', 'You must be administrator');
      this.router.navigate(['/login']);
    }
  }
  private getMe(token: string) {
    this.userService.getMe(token).subscribe({
      next: (res) => {
        if (res) {
          this.user = res;
          if (!this.user.administrator) {
            this.router.navigate(['/home']);
          }
          this.getUsers();
        }
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
      },
    });
  }
  public getUsers(): void {
    this.userService.getUsers(this.token).subscribe({
      next: (res) => {
        if (res) {
          this.users = res;
        }
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
      },
    });
  }

  public getCreditCards(): void {
    if (this.creditCards.length === 0) {
      this.creditCardService.getCreditCards(this.token).subscribe({
        next: (res) => {
          if (res) {
            this.creditCards = res;
          }
        },
        error: (err) => {
          this.alertService.showAutoAlertError(err);
        },
      });
    }
  }

  public deleteRow(object: any): void {
    if (this.isUser(object)) {
      this.deleteUser(object);
    } else if (this.isCreditCard(object)) {
      alert('It is a CreditCard');
    }
  }

  public activeRow(object: any): void {
    if (this.isUser(object)) {
      this.activateUser(object);
    } else if (this.isCreditCard(object)) {
      alert('It is a CreditCard');
    }
  }

  private activateUser(user: User): void {
    this.userService.activateUser(this.token, user.dni).subscribe({
      next: (res) => {
        if (res) {
          this.cdRef.detectChanges();
          this.getUsers();
          this.alertService.showAlert(
            'primary',
            'User ' + user.name + ' account activated'
          );
        }
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
      },
    });
  }

  private deleteUser(user: User): void {
    this.userService.deleteUser(this.token, user.dni).subscribe({
      next: (res) => {
        if (res) {
          this.alertService.showAlert(
            'primary',
            'User ' + user.name + ' account deactivated'
          );
          this.getUsers();
        }
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
      },
    });
  }

  private isUser(obj: any): obj is User {
    return (
      (obj as User).name !== undefined && (obj as User).email !== undefined
    );
  }

  private isCreditCard(obj: any): obj is CreditCard {
    return (
      (obj as CreditCard).number !== undefined &&
      (obj as CreditCard).expiration_date !== undefined
    );
  }
}
