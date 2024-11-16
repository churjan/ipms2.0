import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { EditComponent } from './edit/edit.component';
import { LookComponent } from './look/look.component';
declare var $: any;
@Component({
  selector: 'ina-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.less']
})
export class CustomerComponent extends ListTemplateComponent {
  @ViewChild('edit', { static: false }) _edit: EditComponent;
  @ViewChild('look', { static: false }) _look: LookComponent;

  tableColumns: any[] = []
  btnGroup: any = {};
  showModel: any = {}
  constructor(public router: Router,) {
    super();
    this.modularInit("saleCustomer");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
  async ngOnInit() { }
  openModal(model: any) {
    this._edit.open(model)
  }
  btnEvent(event) {
    switch (event.action) {
      case 'Look':
        this._look.open({ title: 'see', node: event.node })
        return;

    }
    super.btnEvent(event);
  }
}
