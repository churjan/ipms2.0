import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { ClassZtreeComponent } from '~/shared/common/tree/class-ztree.component';
import { UtilService } from '~/shared/services/util.service';
import { MonitoringEditComponent } from './Monitoringedit/Monitoringedit.component';
declare var $: any;
@Component({
  selector: 'app-OutboundMonitoring',
  templateUrl: './OutboundMonitoring.component.html',
  styleUrls: ['./OutboundMonitoring.component.css']
})
export class OutboundMonitoringComponent extends ListTemplateComponent {
  constructor(public router: Router, private fb: FormBuilder,) {
    super();
    this.modularInit("whOutboundMonitoring", router.url, false);
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
  @ViewChild('crud', { static: false }) _crud: CrudComponent;
  @ViewChild('Menu', { static: false }) _Menu: ClassZtreeComponent;
  @ViewChild('edit', { static: false }) _edit: MonitoringEditComponent;
  @ViewChild('Running_out', { static: false }) _Running_out: CrudComponent;
  @ViewChild('out_deyail', { static: false }) _out_deyail: CrudComponent;

  // @ViewChild('edit', { static: false }) _edit: InventoryEditComponent;

  url: string = '';
  pkey: string = '';
  queryParams: any = {}
  ngOnInit(): void { }
  btnEvent(event) {
    switch (event.action) {
      //   case 'Outofstock':
      //     if (! event.node ||  event.node.length <= 0) {
      //       this.message.error(this._appService.translate('checkdata.check_leastoneledata'))
      //       return;
      //     }
      //     let _frozen = event.node.filter(f => f.isfrozen == true);
      //     if (_frozen && _frozen.length > 0) {
      //       this.Confirm('confirm.confirm_Manual', '', (confirmType) => {
      //         if (confirmType == 'pass') {
      //           this.ManualDelivery(event.node);
      //         }
      //       })
      //     } else { this.ManualDelivery(event.node); }
      //     break;
      default:
        break;
    }
    super.btnEvent(event);
  }
  onAction(ev) {
    switch (ev.action) {
      case 'add':
        this._edit.open({ title: 'add', node: { pkey: ev.node ? ev.node.key : '' } });
        return;
    }
  }
  onclick(ev) {
    if (!ev) {
      this._Running_out.SearchModel = {};
    } else if (ev && UtilService.isNotEmpty(ev.bls_key)) {
      this.pkey = ev.bls_key;
      this._Running_out.SearchModel.bls_key = ev.bls_key;
    }
    this._Running_out.Search();
  }
  erfid(ev, line?) {
    let data = ev.data
    if (line == true) data = ev;
    if (ev && data && UtilService.isNotEmpty(data.key)) {
      this._out_deyail.SearchModel.wwom_key = data.key;
      this._out_deyail.Search();
    }
  }
  play(element) {
    this.Confirm('confirm.confirm_close', element.code, (confirmType) => {
      if (confirmType == 'pass') {
        this._service.comPost(this.otherUrl.closeurl, { key: element.key }).then((data) => {
          this.message.success(this.getTipsMsg('sucess.s_close'))
          this.onclick({ bls_key: this.pkey });
        })
      }
    })
  }
  playdetail(element) {
    this.Confirm('confirm.confirm_delcheck', '', (confirmType) => {
      if (confirmType == 'pass') {
        this._service.comPost(this.otherUrl.closedetailurl, { key: element.key }).then((data) => {
          this.message.success(this.getTipsMsg('sucess.s_close'))
          this.erfid({ key: element.wwom_key });
        })
      }
    })
  }
  goHanger(element) {
    if (element) {
      let _tagcode = encodeURIComponent(element.data[element.column.coums]);
      window.open('#/hanger/' + _tagcode);
    } else {
      this.message.success(this.getTipsMsg('warning.empty'));
    }
  }
}
