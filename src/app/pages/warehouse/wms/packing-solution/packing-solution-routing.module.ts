import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PackingSolutionComponent } from './packing-solution.component';
import { environment } from '@/environments/environment';

const routes: Routes = [
    {
        path: 'wms/packingsolution',
        component: PackingSolutionComponent,
        data: environment.routersData.wms['packingsolution'],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PackingSolutionRoutingModule {}
