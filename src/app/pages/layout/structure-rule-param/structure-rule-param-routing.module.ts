import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StructureRuleParamComponent } from './structure-rule-param.component';
import { environment } from '@/environments/environment';
const routes: Routes = [
    {
        path: 'layout/structure-rule-param',
        component: StructureRuleParamComponent,
        data: environment.routersData.layout['structure-rule-param'],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StructureRuleParamRoutingModule {}
