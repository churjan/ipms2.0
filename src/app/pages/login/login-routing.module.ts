import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { environment } from '../../../environments/environment';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: environment.routersData.login
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
