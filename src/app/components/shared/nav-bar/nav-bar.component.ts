import { Component, OnInit } from '@angular/core';
import { APP_CONSTANTS } from '../../../constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
  public lang: string = APP_CONSTANTS.DEFAULT_LANGUAGE;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    const selectedLang = localStorage.getItem(
      APP_CONSTANTS.STORAGE_LANG_NAME || APP_CONSTANTS.DEFAULT_LANGUAGE
    );
  }

  changeLang(lang: any) {
    const selectedLang = lang.target.value;
    localStorage.setItem(APP_CONSTANTS.STORAGE_LANG_NAME, selectedLang);
    this.translateService.use(selectedLang);
  }
}
