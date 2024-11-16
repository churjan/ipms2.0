import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RedirectComponent } from './redirect.component';
import { environment } from '../../../environments/environment';

const routes: Routes = [
  {
    path: 'redirect',
    component: RedirectComponent,
    data: environment.routersData.redirect
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RedirectRoutingModule { }
