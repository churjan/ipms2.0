import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { SharedModule } from '~/shared/shared.module';
import { MenuRoutingModule } from './menu-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NodeComponent } from './node/node.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [MenuComponent, NodeComponent, EditComponent],
  imports: [
    CommonModule,
    MenuRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MenuModule { }
