import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { RoleComponent } from './role.component';
import { EditComponent } from './edit/edit.component';
import { PermissionComponent } from './permission/permission.component';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuTreeComponent } from './edit/menu-tree.component';

@NgModule({
  declarations: [RoleComponent, EditComponent, PermissionComponent,MenuTreeComponent],
  imports: [
    CommonModule,
    RoleRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RoleModule { }
