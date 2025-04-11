import { AfterViewInit, Component, OnInit } from '@angular/core';
import { APP_CONSTANTS } from './constants';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: false,
})
export class AppComponent implements AfterViewInit {
  constructor(
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngAfterViewInit(): void {
    const selectedLang =
      localStorage.getItem(APP_CONSTANTS.STORAGE_LANG_NAME) ||
      APP_CONSTANTS.DEFAULT_LANGUAGE;
    this.translateService.use(selectedLang);
    // Delay check to make sure router has fully initialized
    setTimeout(() => {
      const currentPath = this.router.url; // Get the current URL

      if (
        currentPath === '/login' ||
        currentPath === '/register' ||
        currentPath === '/admin' ||
        currentPath === '/request'
      ) {
        return; // Prevent navigation if we are already on login or register page
      }

      const isSessionSaved =
        localStorage.getItem(APP_CONSTANTS.STORAGE_SESSION_NAME) === 'true';
      let token =
        localStorage.getItem(APP_CONSTANTS.STORAGE_TOKEN_NAME) ||
        sessionStorage.getItem(APP_CONSTANTS.STORAGE_TOKEN_NAME);

      if (token) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
    }, 0); // Use setTimeout to ensure the router is fully initialized
  }
}
