import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@/environments/environment';
import { LayoutStructureManagementComponent } from './layout-structure-management.component';
const routes: Routes = [
    {
        path: 'layout/layout-structure-management',
        component: LayoutStructureManagementComponent,
        data: environment.routersData.layout['layout-structure-management'],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LayoutStructureManagementRoutingModule {}
