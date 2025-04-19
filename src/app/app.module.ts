import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './components/shared/footer/footer.component';
import { NavBarComponent } from './components/shared/nav-bar/nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AlertComponent } from './components/shared/alert/alert.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserFilterPipe } from './pipes/user-filter.pipe';
import { MoneyComponent } from './components/money/money.component';
import { RequestMoneyComponent } from './components/request-money/request-money.component';
import { RequestManageComponent } from './components/request-manage/request-manage.component';
import { FriendsComponent } from './components/friends/friends.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavBarComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    AdminComponent,
    UserFilterPipe,
    MoneyComponent,
    RequestMoneyComponent,
    RequestManageComponent,
    FriendsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    AlertComponent,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent],
})
export class AppModule {}
