import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { AuthService } from '../../services/authentication/auth.service';
import { UserService } from '../../services/user/user.service';
import { AlertService } from '../../services/alert/alert.service';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction/transaction.service';
import { User } from '../../models/user/user';
import { Friend } from '../../models/user/friend';
import { Transaction } from '../../models/transaction/transaction';

@Component({
  selector: 'app-request-money',
  templateUrl: './request-money.component.html',
  styleUrl: './request-money.component.css',
})
export class RequestMoneyComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router,
    private transactionService: TransactionService
  ) {}

  @ViewChildren('transactionElem') transactionElems!: QueryList<ElementRef>;

  public steps = ['Friend', 'Money', 'Confirmation'];
  public currentStep: number = 0;

  public selectedFriends: Friend[] = [];
  public selectedAmount: string = '';
  public selectedMessage: string = '';

  public user: User = {} as User;
  public transactions: Transaction[] = [];
  private token: string = '';

  ngOnInit(): void {
    this.token = this.authService.getToken();

    if (this.token) {
      console.log('Token: ', this.token);
      this.getMe(this.token);
    } else {
      this.router.navigate(['/login']);
    }
  }

  private getMe(token: string) {
    this.userService.getMe(token).subscribe({
      next: (res) => {
        if (res) {
          this.user = res;
          this.getTransactions(token);
        }
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
      },
    });
  }

  public getProgressWidth(): string {
    const percentages = ['18%', '50%', '100%'];
    return percentages[this.currentStep] || '0%';
  }

  public nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      if (this.currentStep == 0) {
        if (this.selectedFriends.length === 0) {
          this.alertService.showAlert('danger', 'Please select a friend');
          return;
        }
      } else if (this.currentStep == 1) {
        if (this.selectedAmount === '') {
          this.alertService.showAlert('danger', 'Please select an amount');
          return;
        }
      }

      this.currentStep++;
    }
  }

  public isUserSelected(friend: Friend): boolean {
    return this.selectedFriends.some((f) => f.dni === friend.dni);
  }

  public prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  public selectFriend(friend: Friend): void {
    if (this.isUserSelected(friend)) {
      this.selectedFriends = this.selectedFriends.filter(
        (f) => f.dni !== friend.dni
      );
    } else {
      this.selectedFriends.push(friend);
    }
  }

  private getTransactions(token: string): void {
    this.transactionService.getTransactions(token).subscribe({
      next: (res) => {
        if (res) {
          this.transactions = res;
        }
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
      },
    });
  }

  public requestMoney(): void {
    for (let i = 0; i < this.selectedFriends.length; i++) {
      const friend = this.selectedFriends[i];

      this.transactionService
        .requestMoney(
          Number(this.selectedAmount),
          friend.dni,
          this.selectedMessage,
          this.token
        )
        .subscribe({
          next: (res) => {
            if (res) {
              this.alertService.showAlert(
                'success',
                'Request sent successfully!'
              );
              this.selectedAmount = '';
              this.selectedMessage = '';
              this.selectedFriends = [];
              this.currentStep = 0;
              this.getTransactions(this.token);
            }
          },
          error: (err) => {
            this.alertService.showAutoAlertError(err);
          },
        });
    }
  }
}
