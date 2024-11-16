import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '@/environments/environment';
import { ProcessDifficultyComponent } from './process-difficulty.component';
const routes: Routes = [
    {
        path: 'bas/process-difficulty',
        component: ProcessDifficultyComponent,
        data: environment.routersData.bas['process-difficulty'],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProcessDifficultyRoutingModule {}
