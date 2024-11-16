import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@/environments/environment';
import { AttributeComponent } from './attribute.component';
const routes: Routes = [
  {
    path: 'bas/attribute',
    component: AttributeComponent,
    data: environment.routersData.bas['attribute'],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttributeRoutingModule { }
