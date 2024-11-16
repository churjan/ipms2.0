import { environment } from '@/environments/environment';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HangerComponent } from './hanger.component';

const routes: Routes = [
  {
    path: 'hangersearch/hanger',
    component: HangerComponent,
    data: environment.routersData.hangersearch.hanger
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HangerRoutingModule { }
