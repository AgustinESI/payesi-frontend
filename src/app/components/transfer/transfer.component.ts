import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AlertService } from '../../services/alert/alert.service';
import { AuthService } from '../../services/authentication/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user/user';
import { Transaction } from '../../models/transaction/transaction';
import { TransactionService } from '../../services/transaction/transaction.service';
import { CreditCard } from '../../models/credit-card/credit-card';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css',
})
export class TransferComponent implements OnInit {
  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private authService: AuthService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  public user: User = {} as User;
  private token: string = '';
  public transactions: Transaction[] = [];
  public selectedCardId: string = '';
  public amount: string = '';

  ngOnInit() {
    this.token = this.authService.getToken();

    if (this.token) {
      this.getMe();
    } else {
      this.router.navigate(['/login']);
    }
  }

  private getMe(): void {
    this.userService.getMe(this.token).subscribe({
      next: (res) => {
        if (res) {
          this.user = res;
          this.getTransactions();
        }
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
      },
    });
  }

  private getTransactions(): void {
    this.transactionService.getTransactions(this.token).subscribe({
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

  public chargefunds(): void {
    if (this.amount) {
      this.transactionService
        .chargeFunds(this.token, this.amount, this.selectedCardId)
        .subscribe({
          next: (res) => {
            if (res) {
              this.alertService.showAlert(
                'success',
                'Funds charged successfully!'
              );
              this.getTransactions();
            }
          },
          error: (err) => {
            this.alertService.showAutoAlertError(err);
          },
        });
    } else {
      this.alertService.showAlert(
        'warning',
        'Please enter an amount to charge.'
      );
    }
  }
}
