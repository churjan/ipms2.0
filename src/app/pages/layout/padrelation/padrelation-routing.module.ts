import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PadRelationComponent } from './padrelation.component';
import { environment } from '../../../../environments/environment';

const routes: Routes = [
  {
    path: 'layout/padrelation',
    component: PadRelationComponent,
    data: environment.routersData.layout.padrelation
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PadrelationRoutingModule { }

