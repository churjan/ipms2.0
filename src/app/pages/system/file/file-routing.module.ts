import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileComponent } from './file.component';
import { environment } from 'src/environments/environment';

const routes: Routes = [
  {
    path: 'sys/file',
    component: FileComponent,
    data: environment.routersData.sys.file
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileRoutingModule { }
