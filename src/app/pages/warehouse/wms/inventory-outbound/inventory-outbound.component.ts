import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { OutboundTaskComponent } from './outbound-task/outbound-task.component';
import { InventoryOutboundService } from './inventory-outbound.service';
import { AppConfig, modularList } from '~/shared/services/AppConfig.service';

@Component({
  selector: 'app-inventory-outbound',
  templateUrl: './inventory-outbound.component.html',
  styleUrls: ['./inventory-outbound.component.less'],
})
export class InventoryOutboundComponent extends ListTemplateComponent {
  @ViewChild('outboundTask') outboundTask: OutboundTaskComponent;
  @ViewChild('controlComponent') controlComponent;
  @ViewChild('crud') crud: CrudComponent;

  isDymanicModularNameMode = true;
  modularNamePrefix = 'wmsInventoryoutbound';
  dynamicModularName = '';

  constructor(public router: Router, private ios: InventoryOutboundService) {
    super();
    // this.modularInit('wmsInventoryoutbound', router.url);
    this.url = router.url.replace(/\//g, '_');
    if (this.url.indexOf('_') == 0) {
      this.url = this.url.substring(1, this.url.length);
    }
  }

  ngOnInit() {
    this.ios.fetchSystemParams('warehouseOutStockDisplayColumns').then((res: any) => {
      const parsedData = JSON.parse(res.data[0]?.value ?? null);
      if (parsedData) {
        for (let key in parsedData) {
          if (key === 'allData') continue;
          const dynamicModularName = `${this.modularNamePrefix}-${key}`;
          AppConfig['columns'][dynamicModularName] = parsedData[key];
          AppConfig['fields'][dynamicModularName] = AppConfig['fields'][this.modularNamePrefix];
          modularList[dynamicModularName] = modularList[this.modularNamePrefix];
        }
      }
    });
  }

  onSelectChange(valueObj) {
    this.dynamicModularName = `${this.modularNamePrefix}-${valueObj.code}`;

    /**
     * 删除缓存 start
     */
    const AllColumns = JSON.parse(localStorage.getItem('AllColumns'));
    if (AllColumns) {
      const column = AllColumns[this.dynamicModularName];
      if (column) {
        delete AllColumns[this.dynamicModularName];
        localStorage.setItem('AllColumns', JSON.stringify(AllColumns));
      }
    }
    localStorage.removeItem('setColumns2');
    /**
     * 删除缓存 end
     */

    this.modularInit(this.dynamicModularName, this.url);
    setTimeout(() => {
      this.crud.init();
      this.crud.GetList();
    }, 100);
  }

  onReset() {}

  btnEvent(ev) {
    switch (ev.action) {
      case 'outboundTask':
        ev.node.control_key = this.crud.seniorModel.control_key;
        this.outboundTask.open(ev,this.dynamicModularName);
        break;

      default:
        break;
    }
  }
}
