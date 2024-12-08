import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { OutboundTaskComponent } from './outbound-task/outbound-task.component';
@Component({
  selector: 'app-inventory-outbound',
  templateUrl: './inventory-outbound.component.html',
  styleUrls: ['./inventory-outbound.component.less'],
})
export class InventoryOutboundComponent extends ListTemplateComponent {
  @ViewChild('outboundTask') outboundTask:OutboundTaskComponent;
  @ViewChild('controlComponent') controlComponent;
  @ViewChild('crud') crud:CrudComponent;
  constructor(public router: Router) {
    super();
    this.modularInit('wmsInventoryoutbound', router.url);
    this.url = router.url.replace(/\//g, '_');
    if (this.url.indexOf('_') == 0) {
      this.url = this.url.substring(1, this.url.length);
    }
  }

  ngOnInit() {
  }

  onReset() {}

  btnEvent(ev) {
    switch (ev.action) {
      case 'outboundTask':
        ev.node.control_key=this.crud.seniorModel.control_key
        this.outboundTask.open(ev);
        break;

      default:
        break;
    }
  }
}
