import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { ZorroAntdModule } from '~/shared/modules/zorro-antd.module';
import { NavbarComponent } from './navbar/navbar.component';
import { TabbarComponent } from './tabbar/tabbar.component';
import { NavbarItemComponent } from './navbar/navbar-item/navbar-item.component';
import { RouterModule } from '@angular/router';
import { PipesModule } from '~/shared/pipes/pipes.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LayoutComponent,
    NavbarComponent,
    NavbarItemComponent,
    TabbarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ZorroAntdModule,
    RouterModule,
    PipesModule
  ],
  exports: [
    LayoutComponent
  ]
})
export class LayoutModule { }
