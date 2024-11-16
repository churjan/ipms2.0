import { environment } from '@/environments/environment';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartOperationComponent } from './partoperation.component';

const routes: Routes = [
  {
    path: 'pdm/partoperation',
    component: PartOperationComponent,
    data: environment.routersData.pdm.partoperation
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartOperationRoutingModule { }
