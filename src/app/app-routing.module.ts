import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { MoneyComponent } from './components/money/money.component';
import { RequestMoneyComponent } from './components/request-money/request-money.component';
import { RequestManageComponent } from './components/request-manage/request-manage.component';
import { FriendsComponent } from './components/friends/friends.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'send', component: MoneyComponent },
  { path: 'request', component: RequestMoneyComponent },
  { path: 'request-manage/:id', component: RequestManageComponent },
  { path: 'friends', component: FriendsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
