import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationComponent } from './operation.component';
import { environment } from 'src/environments/environment';

const routes: Routes = [
  {
    path: 'sys/log/operation',
    component: OperationComponent,
    data: environment.routersData.sys.log.operation
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRoutingModule { }
