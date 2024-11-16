import { environment } from '@/environments/environment';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StyleComponent } from './style.component';
const routes: Routes = [
  {
    path: 'pdm/style',
    component: StyleComponent,
    data: environment.routersData.pdm.style
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StyleRoutingModule { }
