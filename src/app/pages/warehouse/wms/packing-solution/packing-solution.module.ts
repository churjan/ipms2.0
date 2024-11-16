import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PackingSolutionRoutingModule } from './packing-solution-routing.module';
import { PackingSolutionComponent } from './packing-solution.component';
import { PackingSolutionDetailComponent } from './packing-solution-detail/packing-solution-detail.component';
import { PrintModalComponent } from './packing-solution-detail/print-modal/print-modal.component';
import { PackingSolutionSortComponent } from './packing-solution-sort/packing-solution-sort.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [PackingSolutionComponent, PackingSolutionDetailComponent, PrintModalComponent, PackingSolutionSortComponent],
    imports: [
        CommonModule,
        PackingSolutionRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        DragDropModule
    ],
})
export class PackingSolutionModule {}
