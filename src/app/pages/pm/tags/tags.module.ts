import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsComponent } from './tags.component';
import { TagsRoutingModule } from './tags-routing.module'
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angular2-qrcode';
import { NgxBarcodeModule } from '@greatcloak/ngx-barcode'

@NgModule({
  declarations: [TagsComponent],
  imports: [
    CommonModule,
    TagsRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
    QRCodeModule,
    NgxBarcodeModule
  ],
  exports:[
    TagsComponent
  ]
})
export class TagsModule { }
