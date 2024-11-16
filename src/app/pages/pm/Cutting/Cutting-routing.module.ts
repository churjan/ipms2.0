import { environment } from '@/environments/environment';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CuttingComponent } from './Cutting.component';

const routes: Routes = [
  {
    path: 'pm/Cutting',
    component: CuttingComponent,
    data: environment.routersData.pm.Cutting
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class  CuttingRoutingModule { }
