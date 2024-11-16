import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParameterComponent } from './parameter.component';
import { environment } from '../../../../environments/environment';

const routes: Routes = [
  {
    path: 'sys/parameters',
    component: ParameterComponent,
    data: environment.routersData.sys.parameters
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParameterRoutingModule { }
