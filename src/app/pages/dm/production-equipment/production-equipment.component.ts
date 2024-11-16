import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { EditProductionEquipmentComponent } from './edit-production-equipment/edit-production-equipment.component';

@Component({
  selector: 'app-production-equipment',
  templateUrl: './production-equipment.component.html',
  styleUrls: ['./production-equipment.component.less']
})
export class ProductionEquipmentComponent extends ListTemplateComponent {
  constructor(public router: Router,) {
    super();
    this.modularInit("basMachinedevice");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
  @ViewChild('edit', { static: false }) _edit: EditProductionEquipmentComponent;
  @ViewChild('view', { static: false }) _view: EditProductionEquipmentComponent;

  btnEvent(event) {
    switch (event.action) {
      case 'Look':
        this._view.open({ title: 'see', node: event.node })
        return;
    }
    super.btnEvent(event);
  }
  openModal(model: any) {
    this._edit.open(model)
  }
}
