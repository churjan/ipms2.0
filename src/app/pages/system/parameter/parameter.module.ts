import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParameterComponent } from './parameter.component';
import { EditComponent } from './edit/edit.component';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParameterRoutingModule } from './parameter-routing.module'
import { JsonFileComponent } from './edit/JsonFile/JsonFile.component';
import { JsonTreeComponent } from './edit/JsonTree/JsonTree.component';

@NgModule({
  declarations: [ParameterComponent, EditComponent,JsonFileComponent,JsonTreeComponent],
  imports: [
    CommonModule,
    ParameterRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class ParameterModule { }
