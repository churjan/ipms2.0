import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgrammeComponent } from './programme.component';
import { environment } from '../../../../environments/environment';

const routes: Routes = [
  {
    path: 'bas/programme',
    component: ProgrammeComponent,
    data: environment.routersData.bas.programme
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgrammeRoutingModule { }
