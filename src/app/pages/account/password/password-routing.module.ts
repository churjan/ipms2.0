import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PasswordComponent } from './password.component';
import { environment } from '../../../../environments/environment';

const routes: Routes = [
  {
    path: 'account/password',
    component: PasswordComponent,
    data: environment.routersData.account.password
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasswordRoutingModule { }
