import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeightmanagementComponent } from './weightmanagement.component';
import { environment } from '@/environments/environment';

const routes: Routes = [
  {
    path: 'sys/weighingmanagement',
    component: WeightmanagementComponent,
    data: environment.routersData.sys.weighingmanagement,
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeightmanagementRoutingModule { }
