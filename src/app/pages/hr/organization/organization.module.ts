import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationComponent } from './organization.component';
import { OrganizationRoutingModule } from './organizaion-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [OrganizationComponent, EditComponent],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class OrganizationModule { }
