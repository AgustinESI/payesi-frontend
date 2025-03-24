import { Component, OnInit } from '@angular/core';
import { APP_CONSTANTS } from '../../../constants';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/authentication/auth.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
  public lang: string = APP_CONSTANTS.DEFAULT_LANGUAGE;
  public isLoggedIn: boolean = false;

  constructor(
    private translateService: TranslateService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const selectedLang = localStorage.getItem(
      APP_CONSTANTS.STORAGE_LANG_NAME || APP_CONSTANTS.DEFAULT_LANGUAGE
    );

    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  public changeLang(lang: any): void {
    const selectedLang = lang.target.value;
    localStorage.setItem(APP_CONSTANTS.STORAGE_LANG_NAME, selectedLang);
    this.translateService.use(selectedLang);
  }

  public openProfile(): void {
    var value = localStorage.getItem(APP_CONSTANTS.STORAGE_USER_NAME);
    var dni = '0';

    if (value) {
      var user = JSON.parse(value);
      dni = user.dni;
    }

    this.router.navigate(['/profile', dni]);
  }

  logoutUser() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect to login page
  }
}
