import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RunComponent } from './run.component';
import { environment } from 'src/environments/environment';

const routes: Routes = [
  {
    path: 'sys/log/run',
    component: RunComponent,
    data: environment.routersData.sys.log.run
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RunRoutingModule { }
