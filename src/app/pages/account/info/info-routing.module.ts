import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoComponent } from './info.component';
import { environment } from '../../../../environments/environment';

const routes: Routes = [
  {
    path: 'account/info',
    component: InfoComponent,
    data: environment.routersData.account.info
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoRoutingModule { }
