import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@/environments/environment';
import { PartSingletonPOComponent } from './PartSingletonPO.component';
const routes: Routes = [
  {
    path: 'bas/partsingleton',
    component: PartSingletonPOComponent,
    data: environment.routersData.bas['partsingleton'],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartSingletonPORoutingModule { }
