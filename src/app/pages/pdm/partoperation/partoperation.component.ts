import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { EditComponent } from './edit/edit.component';
declare var $: any;
@Component({
  selector: 'app-partoperation',
  templateUrl: './partoperation.component.html',
  styleUrls: ['./partoperation.component.css']
})
export class PartOperationComponent extends ListTemplateComponent {
  constructor(public router: Router) {
    super();
    this.modularInit("pdmPartoperation");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
  @ViewChild('crud', { static: false }) _crud: CrudComponent;
  @ViewChild('edit', { static: false }) _edit: EditComponent;
  style?: any[] = [];
  poc: string = '';
  btnEvent(event) {
    // switch (event.action) {
    //   case 'see':
    //     this.btnActive.emit({ open: { title: 'see', node: event.node, modular: this.modular }, action: event.action })
    //     // this._look.open({ title: 'see', node: event.node })
    //     return;
    //   case 'cancelorder':
    //     this._cancelOrder.open({ title: 'cancelorder', node: event.node })
    //     return;
    // }
    super.btnEvent(event);
  }
  openModal(model: any) {
    this._edit.open(model)
  }
  onclick(ev) {
    if (!ev) { this.SearchModel = {}; } else { this.SearchModel.poc_key = ev.key; }
    this.GetList()
  }
}
