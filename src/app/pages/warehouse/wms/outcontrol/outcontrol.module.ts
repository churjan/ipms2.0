import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutControlComponent } from './outcontrol.component';
import { OutControlRoutingModule } from './outcontrol-routing.module';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { TaskComponent } from './task/task.component';
import { EditComponent as TaskEditComponent } from './task/edit/edit.component';
import { DetailComponent } from './task/detail/detail.component';

@NgModule({
  declarations: [
    OutControlComponent,
    EditComponent,
    TaskComponent,
    TaskEditComponent,
    DetailComponent,
  ],
  imports: [
    CommonModule,
    OutControlRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [DetailComponent, TaskEditComponent],
})
export class OutControlModule {}
