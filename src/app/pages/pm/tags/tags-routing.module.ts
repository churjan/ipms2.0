import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagsComponent } from './tags.component';
import { environment } from '../../../../environments/environment';

const routes: Routes = [
  {
    path: 'pm/tags',
    component: TagsComponent,
    data: environment.routersData.pm.tags
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagsRoutingModule { }
