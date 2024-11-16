import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OuttaskComponent } from './outtask.component';
import { environment } from 'src/environments/environment';

const routes: Routes = [
  {
    path: 'wms/outtask',
    component: OuttaskComponent,
    data: environment.routersData.wms.outtask
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OuttaskRoutingModule { }
