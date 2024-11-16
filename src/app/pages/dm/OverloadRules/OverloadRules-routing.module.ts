import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@/environments/environment';
import { OverloadRulesComponent } from './OverloadRules.component';
const routes: Routes = [
  {
    path: 'bas/OverloadRules',
    component: OverloadRulesComponent,
    data: environment.routersData.bas['OverloadRules'],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionPartsRoutingModule { }
