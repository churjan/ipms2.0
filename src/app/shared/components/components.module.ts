import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from './layout/layout.module';
import { CopyrightModule } from './copyright/copyright.module';
import { DrawerModule } from './drawer/drawer.module';
import { TableModule } from './table/table.module';
import { CrudModule } from './crud/crud.module';
import { EmbedModalModule } from './embed-modal/embed-modal.module';
import { SingleSelectModule } from './single-select/single-select.module';
import { ZPageModule } from './zpage/zpage.module';
import { ZPopupModule } from './zpopup/zpopup.module';
import { EmbedDrawerModule } from './embed-drawer/embed-drawer.module';
import { UserpopupModule } from './userpopup/userpopup.module';
import { ZSelectModule } from './zselect/zselect.module';
import { InaSingleSelectModule } from './ina-single-select/ina-single-select.module';
@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    LayoutModule,
    CopyrightModule,
    DrawerModule,
    TableModule,
    CrudModule,
    ZPageModule,
    ZPopupModule,
    ZSelectModule,
    UserpopupModule,
    EmbedModalModule,
    SingleSelectModule,
    EmbedDrawerModule,
    InaSingleSelectModule
  ],
})
export class ComponentsModule {}
