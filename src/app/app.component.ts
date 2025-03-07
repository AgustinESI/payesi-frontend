import { Component, OnInit } from '@angular/core';
import { APP_CONSTANTS } from './constants';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: false,
})
export class AppComponent {
  title = 'payesi-frontend';

  constructor(
    private router: Router,
    private translateService: TranslateService
  ) {
    this.translateService.setDefaultLang(APP_CONSTANTS.DEFAULT_LANGUAGE);
    this.translateService.use(
      localStorage.getItem(APP_CONSTANTS.STORAGE_LANG_NAME) ||
        APP_CONSTANTS.DEFAULT_LANGUAGE
    );
  }

  ngOnInit(): void {
    var saveSession = localStorage.getItem(APP_CONSTANTS.STORAGE_SESSION_NAME);

    if (saveSession === 'true') {
      var token = localStorage.getItem(APP_CONSTANTS.STORAGE_TOKEN_NAME);
      if (token) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      var token = localStorage.getItem(APP_CONSTANTS.STORAGE_TOKEN_NAME);
      if (token) {
        this.router.navigate(['/home']);
      } else {
        token = sessionStorage.getItem(APP_CONSTANTS.STORAGE_TOKEN_NAME);
        if (token) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/login']);
        }
      }
    }
  }
}
