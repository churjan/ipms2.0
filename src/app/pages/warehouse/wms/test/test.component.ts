import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { OutboundTaskComponent } from './outbound-task/outbound-task.component';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.less'],
})
export class TestComponent extends ListTemplateComponent {
  @ViewChild('outboundTask') outboundTask:OutboundTaskComponent;
  constructor(public router: Router) {
    super();
    this.modularInit('wmsTest', router.url);
    this.url = router.url.replace(/\//g, '_');
    if (this.url.indexOf('_') == 0) {
      this.url = this.url.substring(1, this.url.length);
    }
  }

  onReset() {}

  btnEvent(ev) {
    console.log(ev);  
    switch (ev.action) {
      case 'outboundTask':
        this.outboundTask.open(ev);
        break;

      default:
        break;
    }
  }
}
