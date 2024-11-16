import { environment } from '@/environments/environment';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PadErrComponent } from './padErr.component';

const routes: Routes = [
  {
    path: 'sys/log/paderr',
    component: PadErrComponent,
    data: environment.routersData.sys.log.paderr
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PadErrRoutingModule { }
