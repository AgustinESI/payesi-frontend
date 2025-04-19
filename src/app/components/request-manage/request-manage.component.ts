import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/authentication/auth.service';
import { AlertService } from '../../services/alert/alert.service';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user/user';
import { Transaction } from '../../models/transaction/transaction';
import { TransactionService } from '../../services/transaction/transaction.service';
import { CreditCard } from '../../models/credit-card/credit-card';

@Component({
  selector: 'app-request-manage',
  templateUrl: './request-manage.component.html',
  styleUrl: './request-manage.component.css',
})
export class RequestManageComponent implements OnInit {
  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  private token: string = '';
  public user: User = {} as User;
  public receiver: User = {} as User;
  public transaction: Transaction = {} as Transaction;
  public isProcessing: boolean = false;
  public blocked: boolean = false;
  public showCardSelector: boolean = false;
  public loadingMessage: string = '';

  ngOnInit() {
    this.token = this.authService.getToken();

    if (this.token) {
      var request_id = this.route.snapshot.paramMap.get('id') || '';
      this.getMe();
      this.getTransaction(request_id);
    } else {
      this.router.navigate(['/login']);
    }
  }

  private getTransaction(request_id: string): void {
    this.transactionService
      .getTransactionById(this.token, request_id)
      .subscribe({
        next: (res) => {
          if (res) {
            this.transaction = res;
            this.getReceiver(res.receiver_dni);
          }
        },
        error: (err) => {
          this.blocked = true;
          this.alertService.showAutoAlertError(err);
          if (err.status === 403) {
            this.router.navigate(['/home']);
          }
        },
      });
  }
  private getReceiver(receiver_dni: any): void {
    this.userService.getUserbyDNI(this.token, receiver_dni).subscribe({
      next: (res) => {
        if (res) {
          this.receiver = res;
        }
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
      },
    });
  }

  private getMe(): void {
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

  public acceptTransaction(card: CreditCard): void {
    this.isProcessing = true;
    this.loadingMessage = 'Transfering money...';
    this.transactionService
      .acceptTransaction(this.transaction.id, card.number, this.token)
      .subscribe({
        next: (res) => {
          if (res) {
            setTimeout(() => {
              this.alertService.showAlert(
                'success',
                'Transaction accepted successfully!'
              );
              this.router.navigate(['/home']);
            }, 3000);
          }
        },
        error: (err) => {
          this.isProcessing = false;
          this.alertService.showAutoAlertError(err);
        },
      });
  }

  public rejectTransaction(): void {
    this.isProcessing = true;
    this.loadingMessage = 'Rejecting request...';
    this.transactionService
      .rejectTransaction(this.transaction.id, this.token)
      .subscribe({
        next: (res) => {
          if (res) {
            setTimeout(() => {
              this.alertService.showAlert(
                'success',
                'Transaction rejected successfully!'
              );
              this.router.navigate(['/home']);
            }, 3000);
          }
        },
        error: (err) => {
          this.alertService.showAutoAlertError(err);
        },
      });
  }

  public openCardSelector(): void {
    this.showCardSelector = true;
  }
}
