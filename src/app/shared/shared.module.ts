import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './components/components.module';
import { ModulesModule } from './modules/modules.module';
import { PipesModule } from './pipes/pipes.module';
export { ModulesModule } from './modules/modules.module';
import { DirectivesModule } from './directives/directives.module';
import { SelectInputModule } from './selectInput/selectInput.module';
import { CommonSubUnitModule } from './common/CommonSubUnit.module';

@NgModule({
  exports:[
    ComponentsModule,
    ModulesModule,
    PipesModule,
    DirectivesModule,
    SelectInputModule,
    CommonSubUnitModule
  ],
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
