import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AlertService } from '../../services/alert/alert.service';
import { User } from '../../models/user/user';
import { APP_CONSTANTS } from '../../constants';
import { AuthService } from '../../services/authentication/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  editImage() {
    throw new Error('Method not implemented.');
  }
  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  public selectedFile: File | null = null;
  public previewUrl: string | ArrayBuffer | null = null;
  public imageUrl: string = '';
  private base64String: string = '';

  public user: User = {} as User;
  public currentUser: User = {} as User;
  private token: string = '';
  public editableProfile: boolean = false;
  public edit: boolean = false;
  public followUser: boolean = true;
  private counter = 0;
  public favourite: boolean = false;

  async ngOnInit() {
    this.token = this.authService.getToken();

    if (this.token) {
      var userDNI = this.route.snapshot.paramMap.get('id') || '';
      this.getUser(userDNI);
      this.getMe();
    } else {
      this.router.navigate(['/login']);
    }
  }

  private getUser(userDNI: string): void {
    if (userDNI && userDNI != '0') {
      this.userService.getUserbyDNI(this.token, userDNI).subscribe({
        next: (res) => {
          if (res) {
            this.user = res;
            var value = localStorage.getItem(APP_CONSTANTS.STORAGE_USER_NAME);

            if (value) {
              var user = JSON.parse(value);
              if (user.dni === this.user.dni) {
                this.editableProfile = true;
                this.followUser = false;
              }
            }
          }
        },
        error: (err) => {
          this.alertService.showAutoAlertError(err);
        },
      });
    } else {
      this.getMe();
    }
  }

  private getMe(): void {
    this.userService.getMe(this.token).subscribe({
      next: (res) => {
        if (res) {
          this.currentUser = res;
          this.favourite = this.isUserFavorite();
        }
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
      },
    });
  }

  public editUser(): void {
    this.edit = true;
  }

  public updateUser(): void {
    this.userService.updateUser(this.token, this.user).subscribe({
      next: (res) => {
        if (res) {
          this.user = res;
          this.edit = false;

          this.alertService.showAlert(
            'success',
            'User ' + this.user.name + ' updated'
          );
        }
      },
      error: (err) => {
        this.alertService.showAutoAlertError(err);
      },
    });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      // Convert file to Base64
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result; // Image preview
        this.base64String = (reader.result as string).split(',')[1];
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadImage() {
    if (this.selectedFile && this.base64String) {
      this.userService
        .updateImageUser(this.token, this.base64String)
        .subscribe({
          next: (res) => {
            if (res) {
              this.user = res;
              this.edit = false;
              this.closeModal('imageUploadModal');

              this.alertService.showAlert('success', 'User picture updated');
            }
          },
          error: (err) => {
            this.alertService.showAutoAlertError(err);
          },
        });
    } else {
      this.alertService.showAlert('warning', 'Please select an image first.');
    }
  }

  private closeModal(modal_id: string): void {
    const modalElement = document.getElementById(modal_id);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  private isUserFavorite(): boolean {
    this.counter++;
    console.log(this.counter);
    if (this.currentUser && this.user) {
      const list = new Set(
        this.currentUser.favourite_users.map((friend: any) => friend.dni)
      );
      return list.has(this.user.dni);
    }
    return false;
  }
}
