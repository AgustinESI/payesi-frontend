import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/authentication/auth.service';
import { AlertService } from '../../services/alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user/user';
import { Friend } from '../../models/user/friend';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css',
})
export class FriendsComponent implements OnInit {
  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public user: User = {} as User;
  public usersAll: User[] = [];
  public searchTerm: string = '';

  private token: string = '';

  ngOnInit() {
    this.token = this.authService.getToken();

    if (this.token) {
      this.getMe();
      this.getAllFriends();
    } else {
      this.router.navigate(['/login']);
    }
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

  private getAllFriends(): void {
    this.userService.getUsers(this.token).subscribe({
      next: (res) => {
        if (res) {
          this.usersAll = res.filter(
            (user: User) => user.dni !== this.user.dni
          );
        }
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
      },
    });
  }

  public viewUserProfile(user: User): void {
    this.router.navigate(['/profile/' + user.dni]);
  }

  public addFriend(user: User): void {
    this.userService.createFriendshipRequest(this.token, user.dni).subscribe({
      next: (res) => {
        this.alertService.showAlert(
          'success',
          'Friend request sent successfully'
        );
        this.getMe();
        this.getAllFriends();
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
        console.error(err);
      },
    });
  }

  public removeFriend(user: User): void {
    this.userService.deleteFriend(this.token, user.dni).subscribe({
      next: (response) => {
        this.alertService.showAlert('success', 'Friend deleted successfully');
        this.getMe();
        this.getAllFriends();
      },
      error: (error) => {
        console.error('Error deleting friend:', error);
      },
    });
  }

  public addFavorite(user: User): void {
    this.userService.addFavourite(this.token, user.dni).subscribe({
      next: (res) => {
        this.alertService.showAlert(
          'success',
          user.name + ' added as favourite successfully'
        );
        this.getMe();
        this.getAllFriends();
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
        console.error(err);
      },
    });
  }

  public removeFavorite(user: User): void {
    this.userService.removeFavourite(this.token, user.dni).subscribe({
      next: (res) => {
        this.alertService.showAlert(
          'success',
          user.name + ' removed from favourites successfully'
        );
        this.getMe();
        this.getAllFriends();
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
        console.error(err);
      },
    });
  }

  public isFavorite(user: User): boolean {
    const favourite_users = new Set(
      this.user.favourite_users.map((friend: any) => friend.dni)
    );
    return favourite_users.has(user.dni);
  }

  public isFriend(user: User): boolean {
    const friends_users = new Set(
      this.user.friends.map((friend: any) => friend.dni)
    );
    return friends_users.has(user.dni);
  }

  public blockUser(user: User): void {
    this.userService.blockUser(this.token, user.dni).subscribe({
      next: (res) => {
        this.alertService.showAlert(
          'success',
          user.name +
            ' bloked successfully, you will not recive any notification from this user.'
        );
        this.getMe();
        this.getAllFriends();
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
        console.error(err);
      },
    });
  }
  public unblockUser(user: User): void {
    this.userService.unblockUser(this.token, user.dni).subscribe({
      next: (res) => {
        this.alertService.showAlert(
          'success',
          user.name +
            ' unblocked successfully, you will start reciving notifications from this user.'
        );
        this.getMe();
        this.getAllFriends();
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
        console.error(err);
      },
    });
  }
  public isBlocked(user: User): boolean {
    const blocked_users = new Set(
      this.user.blocked_users.map((friend: any) => friend.dni)
    );
    return blocked_users.has(user.dni);
  }
}
