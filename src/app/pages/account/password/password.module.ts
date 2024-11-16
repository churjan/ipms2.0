import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordRoutingModule } from './password-routing.module';
import { PasswordComponent } from './password.component';
import { LayoutModule } from '../layout/layout.module';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PasswordComponent],
  imports: [
    CommonModule,
    PasswordRoutingModule,
    LayoutModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class PasswordModule { }
