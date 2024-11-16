import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OperationComponent } from './operation.component';
import { OperationRoutingModule } from './operation-routing.module';
import { EditComponent } from './edit/edit.component';
import { ClassEditComponent } from './classEdit/classEdit.component';
import { FilesComponent } from './files/files.component';
import { ToolsComponent } from './tools/tools.component';
import { PairComponent } from './pair/pair.component';
import { WebsiteComponent } from './website/website.component';
import { OperationLookComponent } from './look/operationlook.component';


@NgModule({
  declarations: [
    OperationComponent,
    EditComponent,
    ClassEditComponent,
    FilesComponent,
    ToolsComponent,
    PairComponent,
    WebsiteComponent,
    OperationLookComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    OperationRoutingModule
  ]
})
export class OperationModule { }
