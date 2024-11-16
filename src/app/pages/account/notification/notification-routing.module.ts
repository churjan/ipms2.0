import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationComponent } from './notification.component';
import { environment } from '../../../../environments/environment';

const routes: Routes = [
  {
    path: 'account/notification',
    component: NotificationComponent,
    data: environment.routersData.account.notification
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
