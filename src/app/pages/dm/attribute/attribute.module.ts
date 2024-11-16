import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AttributeRoutingModule } from './attribute-routing.module';
import { AttributeComponent } from './attribute.component';
import { EditComponent } from './edit/edit.component';


@NgModule({
  declarations: [
    AttributeComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    AttributeRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AttributeModule { }
