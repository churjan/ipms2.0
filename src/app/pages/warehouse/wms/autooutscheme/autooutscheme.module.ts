import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutooutschemeComponent } from './autooutscheme.component';
import { AutooutschemeRoutingModule } from './autooutscheme-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { ProgrammeModule } from '../../../layout/programme/programme.module';

@NgModule({
  declarations: [AutooutschemeComponent, EditComponent],
  imports: [
    CommonModule,
    AutooutschemeRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
    ProgrammeModule
  ]
})
export class AutooutschemeModule { }
