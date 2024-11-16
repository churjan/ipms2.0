import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CommFlowComponent } from '~/shared/common/comm-flow/comm-flow.component';
import { HistoryListComponent } from '~/shared/common/history-flow/History-list.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { UtilService } from '~/shared/services/util.service';
import { OutboundEditComponent } from './OutboundEdit/OutboundEdit.component';
declare var $: any;
@Component({
  selector: 'app-Outbound',
  templateUrl: './Outbound.component.html',
  styleUrls: ['./Outbound.component.css']
})
export class OutboundComponent extends ListTemplateComponent {
  constructor(public router: Router, private fb: FormBuilder,) {
    super();
    this.modularInit("whOutofstock");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
  @ViewChild('crud', { static: false }) _crud: CrudComponent;
  @ViewChild('edit', { static: false }) _edit: OutboundEditComponent;

  url: string = '';
  queryParams: any = {}
  ngOnInit(): void { }
  btnEvent(event) {
    switch (event.action) {
      case 'manual-lock':
        if (! event.node ||  event.node.length <= 0) {
          this.message.error(this._appService.translate('checkdata.check_leastoneledata'))
          return;
        }
        this.Confirm('confirm.confirm_delcheck', '', (confirmType) => {
            if (confirmType == 'pass') {
                this._service.comPost(this.otherUrl.closeurl, { key: event.node.key }).then((data) => {
                    this.message.success(this.getTipsMsg('sucess.s_close'))
                    this._crud.reloadData(false);
                })
            }
        })
        break;
      case 'Look':
        this._edit.open({ title: 'see', node: event.node, seach: this._crud['SearchModel'] })
        break;
      default:
        break;
    }
    super.btnEvent(event);
  }
}
