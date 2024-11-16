import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VirtualLayoutComponent } from './Virtual_Layout.component';
import { WorkRoutingModule } from './Virtual_Layout-routing.module';
import { EditComponent } from './edit/edit.component';


@NgModule({
  declarations: [VirtualLayoutComponent,EditComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    WorkRoutingModule
  ]
})
export class VirtualLayoutModule { }
