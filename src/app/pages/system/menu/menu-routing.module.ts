import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu.component';
import { environment } from '../../../../environments/environment';

const routes: Routes = [
  {
    path: 'sys/menu',
    component: MenuComponent,
    data: environment.routersData.sys.menu
  },
  {
    path: 'sys/padmenu',
    component: MenuComponent,
    data: environment.routersData.sys.padmenu
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
