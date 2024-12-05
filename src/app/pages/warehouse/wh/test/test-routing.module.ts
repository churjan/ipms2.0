import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './test.component';
import { environment } from '@/environments/environment';

const routes: Routes = [
  {
    path: 'wms/test',
    component: TestComponent,
    data: environment.routersData.wms['test'],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestRoutingModule {}
