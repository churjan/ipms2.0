import { environment } from '@/environments/environment';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VirtualLayoutComponent } from './Virtual_Layout.component';

const routes: Routes = [
  {
    path: 'layout/virtuallayout',
    component: VirtualLayoutComponent,
    data: environment.routersData.layout.virtuallayout
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkRoutingModule { }
