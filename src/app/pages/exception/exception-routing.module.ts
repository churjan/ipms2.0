import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExceptionComponent } from './exception.component';
import { environment } from '../../../environments/environment';

const routes: Routes = [
  {
    path: 'exception/:code',
    component: ExceptionComponent,
    data: environment.routersData.exception
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExceptionRoutingModule { }
