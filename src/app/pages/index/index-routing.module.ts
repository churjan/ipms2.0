import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index.component';
import { environment } from '../../../environments/environment';

const routes: Routes = [
  {
    path: 'home',
    component: IndexComponent,
    data: environment.routersData.home
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule { }
