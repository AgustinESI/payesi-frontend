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
  public groupUser: boolean = false;

  public selectedCreditCard: CreditCard = {} as CreditCard;
  public selectedfriend: Friend = {} as Friend;
  public groupSelectedFriends: Friend[] = [];
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
        if (this.groupUser) {
          if (this.groupSelectedFriends.length == 0) {
            this.alertService.showAlert('danger', 'Please select a friend');
            return;
          }
        } else {
          if (!this.selectedfriend.dni) {
            this.alertService.showAlert('danger', 'Please select a friend');
            return;
          }
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
    console.log(friend);
    if (this.groupUser) {
      if (this.isUserSelected(friend)) {
        this.groupSelectedFriends = this.groupSelectedFriends.filter(
          (f) => f.dni !== friend.dni
        );
      } else {
        this.groupSelectedFriends.push(friend);
      }
    } else {
      if (this.selectedfriend && this.selectedfriend.dni) {
        this.selectedfriend = {} as Friend;
      } else {
        this.selectedfriend = friend;
      }
    }
  }

  public isUserSelected(friend: Friend): boolean {
    if (this.groupUser) {
      return this.groupSelectedFriends.some((f) => f.dni === friend.dni);
    }
    return this.selectedfriend && this.selectedfriend.dni === friend.dni;
  }

  public sendMoney(): void {
    if (this.groupUser) {
      var amount =
        parseFloat(this.selectedAmount) / this.groupSelectedFriends.length;
      for (let i = 0; i < this.groupSelectedFriends.length; i++) {
        this.sendMoneyRequest(this.groupSelectedFriends[i], amount.toString());
      }
    } else {
      this.sendMoneyRequest(this.selectedfriend, this.selectedAmount);
    }

    this.currentStep = 0;
    this.selectedCreditCard = {} as CreditCard;
    this.selectedfriend = {} as Friend;
    this.selectedAmount = '';
    this.selectedMessage = '';
    this.groupSelectedFriends = [];
  }

  private sendMoneyRequest(friend: Friend, amount: string): void {
    this.transactionService
      .sendMoney(
        this.token,
        amount,
        this.selectedMessage,
        friend.dni,
        this.selectedCreditCard.number
      )
      .subscribe({
        next: (res) => {
          this.alertService.showAlert(
            'success',
            'Money sent successfully to ' + friend.name
          );

          this.getTransactions(this.token);
        },
        error: (err) => {
          this.alertService.showAutoAlertError(err);
        },
      });
  }
}
