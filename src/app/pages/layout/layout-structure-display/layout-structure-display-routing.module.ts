import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutStructureDisplayComponent } from './layout-structure-display.component';
import { environment } from '@/environments/environment';
const routes: Routes = [
  {
    path: 'layout/layout-structure-display',
    component: LayoutStructureDisplayComponent,
    data: environment.routersData.layout['layout-structure-display']
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutStructureDisplayRoutingModule { }
