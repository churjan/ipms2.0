import { ErrorHandler, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NZ_I18N, zh_CN, zh_TW, en_US, vi_VN, ja_JP } from 'ng-zorro-antd/i18n';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

import { registerLocaleData, LocationStrategy, HashLocationStrategy } from '@angular/common';
import zh from '@angular/common/locales/zh';
import en from '@angular/common/locales/en';
import vi from '@angular/common/locales/vi';
import ja from '@angular/common/locales/ja';
registerLocaleData(zh);
registerLocaleData(en);
registerLocaleData(vi);
registerLocaleData(ja);

import { FormsModule } from '@angular/forms';
import { ModulesModule  } from '~/shared/shared.module';

import { SimpleReuseStrategy } from '~/simple-reuse-strategy';
import { RouteReuseStrategy } from '@angular/router';
import { FundebugErrorHandler } from './fundebugErrorHandler';
import { GlobalErrorHandler } from './globalErrorHandler';
import { ServiceLocator } from './shared/services/AppConfig.service';
import { HangerSearchModule } from './pages/hangerSearch/hanger.module';
import { YieldSearchModule } from './pages/yieldSearch/yieldSearch.module';
import { GlobalService } from './global';
import { PadMonitorModule } from './pages/padMonitor/padMonitor.module';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

const providers: Array<any> = [
  { provide: NZ_ICONS, useValue: icons },
  { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy },
  { provide: LocationStrategy, useClass: HashLocationStrategy },
  //{ provide: ErrorHandler, useClass: FundebugErrorHandler}
]
let i18nProvider: any = { provide: NZ_I18N, useValue: zh_CN }
let localLang = localStorage.getItem("language")
if(!localLang){
  // localLang = navigator.language
  if(!localLang){
    localLang = 'Zh'
  }
}
switch(localLang.toLowerCase()){
  case "zh-tw":
    i18nProvider = { provide: NZ_I18N, useValue: zh_TW }
    break
  case "en":
    i18nProvider = { provide: NZ_I18N, useValue: en_US }
    break
  case "vi":
    i18nProvider = { provide: NZ_I18N, useValue: vi_VN }
    break
  case "ja":
    i18nProvider = { provide: NZ_I18N, useValue: ja_JP }
    break
}
providers.push(i18nProvider)

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientJsonpModule,
    HttpClientModule,
    ModulesModule,
    HangerSearchModule,
    YieldSearchModule,
    PadMonitorModule
  ],
  providers: [providers,GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private injector: Injector) { ServiceLocator.injector = injector; }
}
