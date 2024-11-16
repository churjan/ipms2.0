import { environment } from '@/environments/environment';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayingClothComponent } from './layingcloth.component';

const routes: Routes = [
  {
    path: 'pm/layingcloth',
    component: LayingClothComponent,
    data: environment.routersData.pm.layingcloth
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class  LayingClothRoutingModule { }
