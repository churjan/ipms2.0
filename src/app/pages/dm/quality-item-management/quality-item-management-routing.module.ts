import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@/environments/environment';
import { QualityItemManagementComponent } from './quality-item-management.component';
const routes: Routes = [
  {
    path: 'bas/quality',
    component: QualityItemManagementComponent,
    data: environment.routersData.bas['quality'],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityItemManagementRoutingModule { }
