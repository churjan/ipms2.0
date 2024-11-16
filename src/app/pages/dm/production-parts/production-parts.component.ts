import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { EditProductionPartsComponent } from './edit-production-parts/edit-production-parts.component';
import { ViewProductionPartsComponent } from './view-production-parts/view-production-parts.component';

@Component({
  selector: 'app-production-parts',
  templateUrl: './production-parts.component.html',
  styleUrls: ['./production-parts.component.less']
})
export class ProductionPartsComponent extends ListTemplateComponent {

  constructor(public router: Router) {
    super();
    this.modularInit("basPart");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
  @ViewChild('edit', { static: false }) _edit: EditProductionPartsComponent;
  @ViewChild('view', { static: false }) _view: ViewProductionPartsComponent;
  @ViewChild('PartSingleton', { static: false }) _PartSingleton: ViewProductionPartsComponent;

  btnEvent(event) {
    switch (event.action) {
      case 'Look':
        this._view.open({ title: 'see', node: event.node })
        return;
      case 'PartSingleton':
        this._PartSingleton.open({ title: event.title, node: event.node })
        return;
    }
    super.btnEvent(event);
  }
  openModal(model: any) {
    this._edit.open(model)
  }

}
