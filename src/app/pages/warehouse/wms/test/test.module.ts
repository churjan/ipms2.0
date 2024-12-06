import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '~/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TestRoutingModule } from './test-routing.module';
import { TestComponent } from './test.component';
import { OutboundTaskComponent } from './outbound-task/outbound-task.component';

@NgModule({
  declarations: [TestComponent, OutboundTaskComponent],
  imports: [CommonModule, TestRoutingModule, SharedModule, FormsModule, ReactiveFormsModule],
})
export class TestModule {}
