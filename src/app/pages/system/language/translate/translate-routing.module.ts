import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateComponent } from './translate.component';
import { environment } from '../../../../../environments/environment';

const routes: Routes = [
  {
    path: 'sys/lang/translate',
    component: TranslateComponent,
    data: environment.routersData.sys.lang.translate
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TranslateRoutingModule { }
