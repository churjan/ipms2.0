import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '~/auth.guard';
import { LayoutComponent } from '~/shared/components/layout/layout.component';
// import { HangerComponent } from './pages/hanger/hanger.component';
import { environment } from '@/environments/environment';
import { HangerComponent } from './pages/hangerSearch/hanger.component';
import { YieldSearchComponent } from './pages/yieldSearch/yieldSearch.component';
import { PadMonitorComponent } from './pages/padMonitor/padMonitor.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '', loadChildren: () => import('~/app-children.module').then((m) => m.AppChildrenModule) }
    ],
    canActivateChild: [AuthGuard]
  },
  {
    path: 'carrier',
    component: HangerComponent,
  },
  {
    path: 'carrier/:id',
    component: HangerComponent,
  },
  {
    path: 'hanger',
    component: HangerComponent,
  },
  {
    path: 'hanger/:id',
    component: HangerComponent
  },
  {
    path: 'padMonitor',
    component: PadMonitorComponent,
  },
  {
    path: 'padMonitor/:id',
    component: PadMonitorComponent
  },
  {
    path: 'yield',
    component: YieldSearchComponent,
  },
  {
    path: 'yield/:id',
    component: YieldSearchComponent
  },
  {
    path: '',
    loadChildren: () => import('~/pages/login/login.module').then(m => m.LoginModule),
    canActivateChild: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/exception/404',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
