import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@/environments/environment';
import { ProductionPartsComponent } from './production-parts.component';
const routes: Routes = [
  {
    path: 'bas/part',
    component: ProductionPartsComponent,
    data: environment.routersData.bas['part'],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionPartsRoutingModule { }
