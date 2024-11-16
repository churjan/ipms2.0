import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@/environments/environment';
import { ProductionEquipmentComponent } from './production-equipment.component';
const routes: Routes = [
  {
    path: 'bas/machinedevice',
    component: ProductionEquipmentComponent,
    data: environment.routersData.bas['machinedevice'],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionEquipmentRoutingModule { }
