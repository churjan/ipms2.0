import { environment } from '@/environments/environment';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkComponent } from './work.component';

const routes: Routes = [
  {
    path: 'pm/work',
    component: WorkComponent,
    data: environment.routersData.pm.work
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkRoutingModule { }
