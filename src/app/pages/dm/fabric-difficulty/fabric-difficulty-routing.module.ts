import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@/environments/environment';
import { FabricDifficultyComponent } from './fabric-difficulty.component';
const routes: Routes = [
  {
    path: 'bas/fabric-difficulty',
    component: FabricDifficultyComponent,
    data: environment.routersData.bas['fabric-difficulty'],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FabricDifficultyRoutingModule { }
