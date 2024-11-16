import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CommFlowComponent } from '~/shared/common/comm-flow/comm-flow.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { UtilService } from '~/shared/services/util.service';
import { CutClientComponent } from './client/CutClient.component';
import { EditComponent } from './edit/edit.component';
import { StyleFlow2Component } from './styleFlow/styleFlow.component';
import { FlowNew2Component } from './Flownew/Flownew.component';
import { CommFlowthreeComponent } from '~/shared/common/comm-flow3/comm-flow3.component';
import { EditBatchComponent } from './editBatch/editBatch.component';
declare var $: any;
@Component({
  selector: 'app-Cutting',
  templateUrl: './Cutting.component.html',
  styleUrls: ['./Cutting.component.css']
})
export class CuttingComponent extends ListTemplateComponent {
  @ViewChild('crud', { static: false }) _crud: CrudComponent;
  @ViewChild('Client', { static: false }) _Client: CutClientComponent;
  @ViewChild('edit', { static: false }) _edit: EditComponent;
  @ViewChild('editBatch', { static: false }) _editBatch: EditBatchComponent;
  @ViewChild('flow', { static: false }) _flow: CommFlowComponent;
  @ViewChild('Styleflow', { static: false }) _Styleflow: StyleFlow2Component;
  @ViewChild('flownew', { static: false }) _flownew: FlowNew2Component;
  @ViewChild('flow3', { static: false }) _flow3: CommFlowthreeComponent;

  url: string = '';
  constructor(public router: Router, private fb: FormBuilder,) {
    super();
    this.modularInit("pmCutting");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
    this._service.getModel('SystemInfo/getoperationprocesstype/', '', (result) => { sessionStorage.opp_type = result; })
  }
  ngOnInit(): void { }
  btnEvent(event) {
    let flowpower = sessionStorage.process && sessionStorage.process == 'true' ? true : false;
    let mappower = sessionStorage.processroute && sessionStorage.processroute == 'true' ? true : false;
    let wages = sessionStorage.havewages && sessionStorage.havewages == 'true' ? true : false;
    switch (event.action) {
      case 'custAdd':
        let _mo: {} | null;
        if (this.classField) { _mo[this.classField] = this.SearchModel[this.classField] }
        if (!_mo) {
          if (UtilService.isEmpty(this._crud['SearchModel'].station_code)) {
            this.message.error(this.getTipsMsg('checkdata.check_cuting'));
            return;
          }
          _mo = { station_code: this._crud['SearchModel'].station_code }
        }
        this._editBatch.open({ title: 'plus', node: _mo })
        break;
      case 'confirm':
        this._crud.reloadData(false);
        break;
      case 'Flow':
        let node = Object.assign({}, { opp_type: parseInt(sessionStorage.opp_type) })
        if (node.opp_type == 2) {
          node = Object.assign(node, { key: event.node.psi_key, opp_type: parseInt(sessionStorage.opp_type) })
          this._Styleflow.open({ title: 'PWRM', node: node, type: 'S', power: { Iscopy: false, IsUpdate: true, flowpower: flowpower, mappower: mappower, wages: wages } })
        } else {
          node = Object.assign(node, { key: event.node.pwb_key, psi_key: event.node.psi_key, })
          this._flow.open({ title: 'PWRM', node: node, type: 'W', power: { Iscopy: true, IsUpdate: true, wages: wages, flowpower: flowpower, mappower: mappower } })
        }
        break;
      case 'newFlow':
        let { pwb_code, pwb_key, pwb_state, psi_key, pwb_state_name } = event.node
        let body: any = Object.assign({}, { other_node: { key: pwb_key, code: pwb_code, state: pwb_state, state_name: pwb_state_name, psi_key }, type: 'W' })
        this._service.comList('WorkBillOperationProcess/Extend/GetByWorkbill', { pwb_key: pwb_key }).then((v) => {
          body = Object.assign(body, {
            title: 'CPWRM',
            power: { Iscopy: true, IsUpdate: pwb_state != 0 ? false : true, wages: wages, flowpower: flowpower, mappower: mappower },
            node: {}
          })
          if (v) {
            body.title = 'PWRM';
            body.node = { key: v.popm_key, pwb_key: v.pwb_key, psi_key: event.node.psi_key, flowstate: true, state: event.node.state }
            this._service.getModel('admin/OperationProcessMaster/', v.popm_key, (s) => {
              body.node = Object.assign({}, { key: s.key, name: s.name, is_back_flow: s.is_back_flow, pwb_key: v.pwb_key, psi_key: psi_key, flowstate: true, state: pwb_state })
              body.worksectionlist = s.worksectionlist;
              if (s.worksectionlist.length > 0) { body.node.bwi_key = s.worksectionlist[0].bwi_key }
              this._flow3.open(body);
            })
          } else {
            // if (pwb_state == 0) {
            body.isNull = true;
            this._flownew.open({ title: 'PWRM', node: { key: psi_key }, type: 'S', power: { Iscopy: false, IsUpdate: true, flowpower: flowpower, mappower: mappower, wages: wages } })
            // } else {
            //   this.message.error(this.getTipsMsg('warning.noNewcreate'))
            // }
          }
        })
        break;
      case 'return':
        this._flownew.open(event.node)
        break
      case 'copyset':
        this._flownew.open(event.node)
        break
      case 'setClient':
        if (UtilService.isEmpty(this._crud['SearchModel'].station_code)) {
          this.message.error(this.getTipsMsg('checkdata.check_cuting'));
          return;
        }
        this._Client.open({ title: event.title, node: { station_code: this._crud['SearchModel'].station_code } })
        break;
      default:
        break;
    }
    super.btnEvent(event);
  }
  onclick($event) {
    this._crud.SearchModel.station_code = $event ? $event.code : '';
    this._crud.reloadData(true);
  }
  openModal(model: any) {
    if (!model.node) {
      if (UtilService.isEmpty(this._crud['SearchModel'].station_code)) {
        this.message.error(this.getTipsMsg('checkdata.check_cuting'));
        return;
      }
      model.node = { station_code: this._crud['SearchModel'].station_code }
    }
    this._edit.open(model)
  }
  play(element) {
    let o = this.list.find(p => p.enable == true)
    if (o && o.key != element.key) {
      this.message.error(this.getTipsMsg('warning.iputs'));
      return;
    }
    this._service.comPost(this.otherUrl.enable, { key: element.key }).then((result) => {
      this.message.success(this.getTipsMsg(element.enable == true ? 'sucess.s_close' : 'sucess.s_open'));
      this._crud.reloadData(false);
    });
  }
}
