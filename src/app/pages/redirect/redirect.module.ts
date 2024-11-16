import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RedirectComponent } from './redirect.component';
import { RedirectRoutingModule } from './redirect-routing.module';
import { SharedModule } from '~/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RedirectRoutingModule,
    SharedModule
  ],
  declarations: [
    RedirectComponent
  ]
})
export class RedirectModule { }
