import { Component, OnInit } from '@angular/core';
import { APP_CONSTANTS } from '../../constants';
import { AuthService } from '../../services/authentication/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { AlertService } from '../../services/alert/alert.service';
import { User } from '../../models/user/user';
import { TransactionService } from '../../services/transaction/transaction.service';
import { Transaction } from '../../models/transaction/transaction';
import { CreditCard } from '../../models/credit-card/credit-card';
import { CreditCardService } from '../../services/credit-card/credit-card.service';
declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertService: AlertService,
    private transactionService: TransactionService,
    private creditCardService: CreditCardService,
    private router: Router
  ) {}

  private token: string = '';
  public user: User = {} as User;
  public transactions: Transaction[] = [];
  public addCard: CreditCard = {} as CreditCard;
  public requestUser: User = {} as User;
  public requestAmount: number = 0;
  public requestMessage: string = '';
  public requestCreditCard: CreditCard = {} as CreditCard;

  ngOnInit(): void {
    this.token = this.authService.getToken();

    if (this.token) {
      console.log('Token: ', this.token);
      this.getMe(this.token);
    } else {
      this.router.navigate(['/login']);
    }

    this.addCard.type = 'visa';
  }

  private getTransactions(token: string) {
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
          localStorage.setItem(
            APP_CONSTANTS.STORAGE_USER_NAME,
            JSON.stringify(this.user)
          );
        }
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
      },
    });
  }

  public requestMoney(): void {
    if (this.requestAmount <= 0) {
      this.alertService.showAlert('warning', 'Amount must be greater than 0');
    }

    if (!this.requestUser) {
      this.alertService.showAlert('warning', 'You should select a user');
    }

    if (!this.requestCreditCard) {
      this.alertService.showAlert('warning', 'You should select a user');
    }

    this.transactionService
      .requestMoney(
        this.requestAmount,
        this.requestUser.dni,
        this.requestMessage,
        this.requestCreditCard,
        this.token
      )
      .subscribe({
        next: (res) => {
          this.alertService.showAlert('success', 'Request sent successfully');
        },
        error: (err) => {
          this.alertService.showAutoAlertError(err);
        },
      });
  }

  public formatCardNumber(): void {
    let rawNumber = this.addCard.number.replace(/\D/g, '');

    this.addCard.number = rawNumber
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .substring(0, 19);
  }

  public formatExpirationDate() {
    let formattedValue = this.addCard.expiration_date.replace(/\D/g, '');
    if (formattedValue.length >= 3) {
      formattedValue =
        formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
    }
    this.addCard.expiration_date = formattedValue;
  }

  saveCreditCard(): void {
    // Validate required fields
    if (
      !this.addCard.number ||
      !this.addCard.card_holder_name ||
      !this.addCard.expiration_date ||
      !this.addCard.cvv
    ) {
      this.alertService.showAlert('warning', 'Please fill in all fields');
      return;
    }

    // Call the service to save the credit card
    this.creditCardService.addCreditCard(this.token, this.addCard).subscribe({
      next: (res) => {
        this.alertService.showAlert(
          'success',
          'Credit card saved successfully'
        );
        this.addCard = {
          number: '',
          card_holder_name: '',
          expiration_date: '',
          cvv: '',
          active: true,
          type: 'visa',
          user_dni: '',
        };
        this.closeModal('addCreditCard');
      },
      error: (err) => {
        this.alertService.showAlert('danger', 'Failed to save credit card');
        console.error(err);
      },
    });
  }

  public deleteCreditCard(number: string): void {
    this.creditCardService.deleteCreditCard(this.token, number).subscribe({
      next: (res) => {
        this.alertService.showAlert(
          'success',
          'Credit card saved successfully'
        );
        this.addCard = {
          number: '',
          card_holder_name: '',
          expiration_date: '',
          cvv: '',
          active: true,
          type: 'visa',
          user_dni: '',
        };
        this.closeModal('addCreditCard');
        this.getMe(this.token);
      },
      error: (err) => {
        this.alertService.showAlert('danger', 'Failed to save credit card');
        console.error(err);
      },
    });
  }
  public closeModal(modal_id: string): void {
    const modalElement = document.getElementById(modal_id);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }
}
