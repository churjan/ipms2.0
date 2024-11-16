import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CommFlowComponent } from '~/shared/common/comm-flow/comm-flow.component';
import { HistoryListComponent } from '~/shared/common/history-flow/History-list.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { UtilService } from '~/shared/services/util.service';
import { InStorageEditComponent } from './inStorageEdit/inStorageEdit.component';
declare var $: any;
@Component({
  selector: 'app-inStorage',
  templateUrl: './inStorage.component.html',
  styleUrls: ['./inStorage.component.css']
})
export class InStorageComponent extends ListTemplateComponent {
  @ViewChild('crud', { static: false }) _crud: CrudComponent;
  @ViewChild('edit', { static: false }) _edit: InStorageEditComponent;

  url: string = '';
  constructor(public router: Router, private fb: FormBuilder,) {
    super();
    this.modularInit("whWarehousing");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
  ngOnInit(): void { }
  btnEvent(event) {
    switch (event.action) { 
      case 'Look':
        this._edit.open({ title: 'see', node: event.node, seach: this._crud['SearchModel'] })
        break;
      default:
        break;
    }
    super.btnEvent(event);
  }
}
