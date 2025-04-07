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
import { FriendshipRequest } from '../../models/user/friendship-request';
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
  public searchTerm: string = '';
  public user: User = {} as User;
  public transactions: Transaction[] = [];
  public addCard: CreditCard = {} as CreditCard;
  public requestUser: User = {} as User;
  public requestAmount: number = 0;
  public requestMessage: string = '';
  public requestCreditCard: CreditCard = {} as CreditCard;
  public usersFriends: User[] = [];
  public pendingFriendRequests: FriendshipRequest[] = [];

  ngOnInit(): void {
    this.token = this.authService.getToken();

    if (this.token) {
      console.log('Token: ', this.token);
      this.getMe(this.token);
      this.getAllFriends(this.token);
      this.getPendingRequests(this.token);
    } else {
      this.router.navigate(['/login']);
    }

    this.addCard.type = 'visa';
  }

  private getAllFriends(token: string): void {
    this.userService.getUsers(token).subscribe({
      next: (res) => {
        if (res) {
          const friendsDniSet = new Set(
            this.user.friends.map((friend: any) => friend.dni)
          );
          this.usersFriends = res
            .filter(
              (user: { dni: string }) =>
                user.dni !== this.user.dni && !friendsDniSet.has(user.dni)
            )
            .map((user: any) => ({
              ...user,
              selected: false,
            }));
        }
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
      },
    });
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
    this.closeModal('addCreditCard');
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
        this.getMe(this.token);
      },
      error: (err) => {
        this.alertService.showAlert('danger', 'Failed to save credit card');
        console.error(err);
      },
    });
  }

  public deleteCreditCard(number: string): void {
    this.closeModal('addCreditCard');
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

  public sendFriendRequests(): void {
    this.closeModal('addFriend');
    const selectedUsers = this.usersFriends.filter(
      (user: any) => user.selected
    );

    // Check if there are any selected users
    if (selectedUsers.length === 0) {
      this.alertService.showAlert('warning', 'No users selected');
      return;
    }

    for (let user of selectedUsers) {
      console.log('Sending friend request to:', user.dni);
      this.userService.createFriendshipRequest(this.token, user.dni).subscribe({
        next: (res) => {
          this.alertService.showAlert(
            'success',
            'Friend request sent successfully'
          );
        },
        error: (err) => {
          this.alertService.showAutoAlertError(err);
          console.error(err);
        },
      });
    }
  }

  private getPendingRequests(token: string): void {
    this.userService.getPendingFriendshipRequests(token).subscribe({
      next: (res) => {
        console.log('Pending requests:', res);
        this.pendingFriendRequests = res;

        if (this.pendingFriendRequests.length == 0) {
          this.closeModal('friendRequestsModal');
        }
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
      },
    });
  }

  public openFriendRequestsModal(): void {}

  public respondToRequest(requestId: number, status: boolean): void {
    if (status) {
      this.userService
        .acceptFriendshipRequest(this.token, requestId)
        .subscribe({
          next: (res) => {
            this.alertService.showAlert(
              'success',
              'Friend request accepted successfully'
            );
            this.getPendingRequests(this.token);
            this.getMe(this.token);
          },
          error: (err) => {
            this.alertService.showAutoAlertError(err);
          },
        });
    } else {
      this.userService
        .declineFriendshipRequest(this.token, requestId)
        .subscribe({
          next: (res) => {
            this.alertService.showAlert(
              'success',
              'Friend request declined successfully'
            );
            this.getPendingRequests(this.token);
          },
          error: (err) => {
            this.alertService.showAutoAlertError(err);
          },
        });
    }
  }

  public deleteFriend(friendDni: string): void {
    this.userService.deleteFriend(this.token, friendDni).subscribe({
      next: (response) => {
        this.alertService.showAlert('success', 'Friend deleted successfully');
        this.getMe(this.token);
        this.getAllFriends(this.token);
      },
      error: (error) => {
        console.error('Error deleting friend:', error);
      },
    });
  }

  public viewProfile(dni: string): void {
    this.router.navigate(['/profile/' + dni]);
  }
}
