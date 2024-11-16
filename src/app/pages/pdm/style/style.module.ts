import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StyleRoutingModule } from './style-routing.module';
import { EditComponent } from './edit/edit.component';
import { StyleComponent } from './style.component';
import { ClassEditComponent } from './classEdit/classEdit.component';
import { FilesComponent } from './files/files.component';
import { StyleFlowComponent } from './styleFlow/styleFlow.component';
import { StyleLookComponent } from './look/stylelook.component';
import { FilesViewComponent } from './look/files-view/files-view.component';
import { StyleFlowNewComponent } from './styleFlownew/styleFlownew.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    StyleRoutingModule
  ],
  declarations: [
    StyleComponent,
    EditComponent,
    ClassEditComponent,
    FilesComponent,
    StyleFlowComponent,
    StyleLookComponent,
    FilesViewComponent,
    StyleFlowNewComponent
  ]
})
export class StyleModule { }
