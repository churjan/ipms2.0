import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@/environments/environment';
import { DocLibraryComponent } from './doc-library.component';
const routes: Routes = [
    {
        path: 'bas/FilesInfo',
        component: DocLibraryComponent,
        data: environment.routersData.bas['FilesInfo'],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DocLibraryRoutingModule {}
