import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DictionaryComponent } from './dictionary.component';
import { environment } from '../../../../environments/environment';

const routes: Routes = [
  {
    path: 'sys/classify',
    component: DictionaryComponent,
    data: environment.routersData.sys.classify
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DictionaryRoutingModule { }
