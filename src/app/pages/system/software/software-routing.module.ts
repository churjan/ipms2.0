import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SoftwareComponent } from './software.component';
import { environment } from '../../../../environments/environment';

const routes: Routes = [
  {
    path: 'sys/software',
    component: SoftwareComponent,
    data: environment.routersData.sys.software
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SoftwareRoutingModule { }
