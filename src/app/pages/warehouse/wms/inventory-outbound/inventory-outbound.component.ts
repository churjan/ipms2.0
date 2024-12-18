import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { OutboundTaskComponent } from './outbound-task/outbound-task.component';
import { InventoryOutboundService } from './inventory-outbound.service';
@Component({
  selector: 'app-inventory-outbound',
  templateUrl: './inventory-outbound.component.html',
  styleUrls: ['./inventory-outbound.component.less'],
})
export class InventoryOutboundComponent extends ListTemplateComponent {
  @ViewChild('outboundTask') outboundTask: OutboundTaskComponent;
  @ViewChild('controlComponent') controlComponent;
  @ViewChild('crud') crud: CrudComponent;
  constructor(public router: Router, private ios: InventoryOutboundService) {
    super();
    this.modularInit('wmsInventoryoutbound', router.url);
    this.url = router.url.replace(/\//g, '_');
    if (this.url.indexOf('_') == 0) {
      this.url = this.url.substring(1, this.url.length);
    }
  }

  ngOnInit() {
    // this.ios.fetchSystemParams('warehouseOutStockDisplayColumns').then((res: any) => {
    //   const value = JSON.parse(res.data[0]?.value ?? null);
    //   console.log(value);
    //   console.log(typeof value);
    // });
  }

  onSelectChange(valueObj){
    console.log(valueObj)
  }

  onReset() {}

  btnEvent(ev) {
    switch (ev.action) {
      case 'outboundTask':
        ev.node.control_key = this.crud.seniorModel.control_key;
        this.outboundTask.open(ev);
        break;

      default:
        break;
    }
  }
}
