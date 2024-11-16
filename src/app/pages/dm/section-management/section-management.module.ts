import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SectionManagementRoutingModule } from './section-management-routing.module';
import { SectionManagementComponent } from './section-management.component';
import { EditSectionComponent } from './edit-section-management/edit-section-management.component';
import { ViewSectionManagementComponent } from './view-section-management/view-section-management.component';


@NgModule({
  declarations: [
    SectionManagementComponent,
    ViewSectionManagementComponent,
    EditSectionComponent,
  ],
  imports: [
    CommonModule,
    SectionManagementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SectionManagementModule { }
