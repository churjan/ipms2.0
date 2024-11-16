import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CommFlowComponent } from '~/shared/common/comm-flow/comm-flow.component';
import { HistoryListComponent } from '~/shared/common/history-flow/History-list.component';
import { CrudComponent } from '~/shared/components/crud/crud.component';
import { UtilService } from '~/shared/services/util.service';
import { EditComponent } from './edit/edit.component';
declare var $: any;
@Component({
  selector: 'app-HandStation',
  templateUrl: './HandStation.component.html',
  styleUrls: ['./HandStation.component.css']
})
export class HandStationComponent extends ListTemplateComponent {
  @ViewChild('crud', { static: false }) _crud: CrudComponent;
  @ViewChild('edit', { static: false }) _edit: EditComponent;

  url: string = '';
  constructor(public router: Router, private fb: FormBuilder,) {
    super();
    this.modularInit("layoutHandStation");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
  btnEvent(event) {
    switch (event.action) {
      case 'confirm':
        this._crud.reloadData(false);
        break;
      default:
        break;
    }
    super.btnEvent(event);
  }
  openModal(model: any) {
    this._edit.open(model)
  }
  ngOnInit(): void {
  }
}
