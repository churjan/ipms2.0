import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VersionComponent } from './version.component';
import { environment } from '../../../../../environments/environment';

const routes: Routes = [
  {
    path: 'sys/lang/version',
    component: VersionComponent,
    data: environment.routersData.sys.lang.version
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VersionRoutingModule { }
