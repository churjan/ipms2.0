import { environment } from '@/environments/environment';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YieldSearchComponent } from './yieldSearch.component';

const routes: Routes = [
  {
    path: 'yieldsearch/yield',
    component: YieldSearchComponent,
    data: environment.routersData.yieldsearch.yield
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YieldSearchRoutingModule { }
