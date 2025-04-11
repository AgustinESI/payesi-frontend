import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert/alert.service';
import { AuthService } from '../../services/authentication/auth.service';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user/user';
import { CreditCard } from '../../models/credit-card/credit-card';
import { Friend } from '../../models/user/friend';
import { TransactionService } from '../../services/transaction/transaction.service';
import { Transaction } from '../../models/transaction/transaction';

@Component({
  selector: 'app-money',
  templateUrl: './money.component.html',
  styleUrl: './money.component.css',
})
export class MoneyComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router,
    private transactionService: TransactionService
  ) {}

  public steps = ['Credit Card', 'Friend', 'Money', 'Confirmation'];
  public currentStep: number = 0;
  public user: User = {} as User;
  public transactions: Transaction[] = [];

  public selectedCreditCard: CreditCard = {} as CreditCard;
  public selectedfriend: Friend = {} as Friend;
  public selectedAmount: string = '';
  public selectedMessage: string = '';

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
    const percentages = ['15%', '38%', '62%', '100%'];
    return percentages[this.currentStep] || '0%';
  }

  public nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      if (this.currentStep == 0) {
        if (!this.selectedCreditCard.expiration_date) {
          this.alertService.showAlert('danger', 'Please select a credit card');
          return;
        }
      } else if (this.currentStep == 1) {
        if (!this.selectedfriend.dni) {
          this.alertService.showAlert('danger', 'Please select a friend');
          return;
        }
      } else if (this.currentStep == 2) {
        if (this.selectedAmount.length == 0) {
          this.alertService.showAlert('danger', 'Please select an amount');
          return;
        }
      }

      this.currentStep++;
    }
  }

  public prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  public selectCard(card: CreditCard): void {
    if (this.selectedCreditCard && this.selectedCreditCard.expiration_date) {
      this.selectedCreditCard = {} as CreditCard;
    } else {
      this.selectedCreditCard = card;
    }
  }

  public selectFriend(friend: Friend): void {
    if (this.selectedfriend && this.selectedfriend.dni) {
      this.selectedfriend = {} as Friend;
    } else {
      this.selectedfriend = friend;
    }
  }

  public sendMoney(): void {
    this.transactionService
      .sendMoney(
        this.token,
        this.selectedAmount,
        this.selectedMessage,
        this.selectedfriend.dni,
        this.selectedCreditCard.number
      )
      .subscribe({
        next: (res) => {
          this.alertService.showAlert('success', 'Money sent successfully');
          this.currentStep = 0;
          this.selectedCreditCard = {} as CreditCard;
          this.selectedfriend = {} as Friend;
          this.selectedAmount = '';
          this.selectedMessage = '';
        },
        error: (err) => {
          this.alertService.showAutoAlertError(err);
        },
      });
  }
}
