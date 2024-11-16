import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@/environments/environment';
import { SectionManagementComponent } from './section-management.component';
const routes: Routes = [
    {
        path: 'bas/worksection',
        component: SectionManagementComponent,
        data: environment.routersData.bas.worksection,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SectionManagementRoutingModule {}
