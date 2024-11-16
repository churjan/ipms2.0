import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CommFlowNewComponent } from '~/shared/common/comm-flow-new/comm-flow-new.component';
import { CommFlowComponent } from '~/shared/common/comm-flow/comm-flow.component';
import { CommFlowthreeComponent } from '~/shared/common/comm-flow3/comm-flow3.component';
import { HistoryListComponent } from '~/shared/common/history-flow/History-list.component';
import { HistoryComponent } from '~/shared/common/history/History-list.component';
import { CrudComponent } from '~/shared/components/crud/crud.component';
import { AppConfig } from '~/shared/services/AppConfig.service';
import { EditComponent } from './edit/edit.component';
import { FlowLaminationComponent } from './flowLamination/flowLamination.component';
import { HangInfoComponent } from './hanginfo/hanginfo.component';
import { LookComponent } from './look/look.component';
import { SetTagsContent } from './setTags/setTags.component';
import { SetTags2Content } from './setTags2/setTags2.component';
declare var $: any;
@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent extends ListTemplateComponent {
  @ViewChild('crud', { static: false }) _crud: CrudComponent;
  @ViewChild('edit', { static: false }) _edit: EditComponent;
  @ViewChild('flow', { static: false }) _flow: CommFlowComponent;
  // @ViewChild('flow', { static: false }) _flow: CommFlowOldComponent;
  @ViewChild('newflow', { static: false }) _newflow: CommFlowNewComponent;
  @ViewChild('flow3', { static: false }) _flow3: CommFlowthreeComponent;
  @ViewChild('flowLamination', { static: false }) _flowLamination: FlowLaminationComponent;
  @ViewChild('setTags', { static: false }) _setTags: SetTagsContent;
  @ViewChild('setTags2', { static: false }) _setTags2: SetTags2Content;
  @ViewChild('History', { static: false }) _History: HistoryListComponent;
  @ViewChild('History2', { static: false }) _History2: HistoryComponent;
  @ViewChild('worklook', { static: false }) _worklook: LookComponent;
  @ViewChild('hanginfo', { static: false }) _hanginfo: HangInfoComponent;

  url: string = '';
  hoi_key = sessionStorage.hoi_key ? sessionStorage.hoi_key : '';
  setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', url: 'organizationinfo' }
  constructor(public router: Router, private fb: FormBuilder,) {
    super();
    this.modularInit("pmWork", router.url);
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
    // this._service.getModel('SystemInfo/getoperationprocesstype/', '', (result) => { sessionStorage.opp_type = result; })
  }
  options: any[] = [];
  multikey: string = '';
  isReset: boolean;
  issearch: boolean = false;
  isVisible: boolean = false;
  Visinode: any = {};
  btnEvent(event) {
    let flowpower = sessionStorage.process && sessionStorage.process == 'true' ? true : false;
    let mappower = sessionStorage.processroute && sessionStorage.processroute == 'true' ? true : false;
    let wages = sessionStorage.havewages && sessionStorage.havewages == 'true' ? true : false;
    switch (event.action) {
      case 'Flow':
        event.node.opp_type = event.node.opp_type ? event.node.opp_type : parseInt(sessionStorage.opp_type);
        // if (event.node.state != 0 && event.node.state != 1) { this.inpara.IsUpdate = false; }
        this._flow.open({ title: 'PWRM', node: event.node, type: 'W', power: { Iscopy: true, IsUpdate: event.node.state != 0 ? false : true, wages: wages, flowpower: flowpower, mappower: mappower } })
        return;
      case 'Tags':
        this._setTags.open({ title: 'tagbind', node: event.node })
        return;
      case 'Tagsbatch':
        this._modalService.confirm({
          nzTitle: this._appService.translate("confirm.confirm_Tagsbatch"),
          nzContent: '',
          nzOnOk: () => {
            let node = new Array();
            event.node.forEach(element => {
              node.push({ pwb_key: element.key })
            });
            this._service.comPost(this.otherUrl.setTagsbatch, node).then((result) => {
              this._crud.reloadData(null)
              this.message.success(this.getTipsMsg('sucess.s_create'));
            }, (msg) => { });
          }
        });
        return;
      case 'Tags2':
        this._service.comList('SystemInfo/getcreatetagmode', {}, '', false).then(v => {
          if (v == 0) {
            this.isVisible = true;
            this.Visinode = event.node;
          } else {
            this._setTags2.open({ title: 'tagbind', node: event.node, tagmode: v })
          }
        })
        return;
      case 'Exp':
        let _SearchModel = Object.assign({}, this.SearchModel, this.seniorModel);
        super.Exp(_SearchModel);
        return;
      case 'Look':
        this._worklook.open({ title: 'see', node: event.node })
        return;
      case 'Hanger':
        this._hanginfo.open({ title: 'see', node: event.node })
        return;
      case 'History':
        this._History.open({ title: 'flowHistory', btnaction: event.sonbtn, node: event.node })
        return;
      case 'historyflownew':
        this._service.comList('WorkBillOperationProcess/Extend/GetByWorkbill', { pwb_key: event.node.key }).then((v) => {
          if (v)
            this._History2.open({
              title: 'flowHistory', btnaction: {
                common: [{ action: "Look", juris: "pm_work_Look", key: "354df954-797b-4042-a0b3-ed5bd0032c05", name: "查看", smi_key: "ddadb10f-8825-4da0-a0f0-bbdfb53f3ebb", sort: 4, speciallimits: 0 }]
              }, node: v
            })
        });
        return;
      case 'Confirm':
        this._modalService.confirm({
          nzTitle: this._appService.translate("confirm.confirm_production"),
          nzContent: '',
          nzOnOk: () => {
            this._service.comPost(this.otherUrl.confirm, { key: event.node.key }).then((result) => {
              this._crud.reloadData(null)
              this.message.success(this.getTipsMsg('sucess.s_Con'));
            }, (msg) => { });
          }
        });
        return;
      case 'onekeycopy':
        event.node.key = null;
        this.openModal({ title: 'plus', node: event.node });
        // this._modalService.confirm({
        //   nzTitle: this._appService.translate("confirm.confirm_onekeycopy"),
        //   nzContent: '',
        //   nzOnOk: () => {
        //     // let node = Object.assign({ model: null, url: this.modular.url, list: this.list, keyfeild: this.keyfeild, namefeild: this.namefeild }, event.node)
        //     // let delkey: any;
        //     // let name: string;
        //     // if (node.model) {
        //     //   // delkey = node.model[node.keyfeild];
        //     //   delkey = [node.model];
        //     //   name = node.model[node.namefeild];
        //     // } else {
        //     //   this.multipleSelect(function (m) { delkey = m.delkey; name = m.name; }, node.list);
        //     // }
        //     this._service.comPost(this.otherUrl.keycopy, { key: event.node.key }).then((result) => {
        //       this._crud.reloadData(null)
        //       this.message.success(this.getTipsMsg('sucess.s_Con'));
        //     }, (msg) => { });
        //   }
        // });
        return;
      case 'Back':
        this._flowLamination.open(event)
        return;
      case "flowLamin":
        let body: any = Object.assign({}, { other_node: event.node, type: 'W' })
        this._service.comList('WorkBillOperationProcess/Extend/GetByWorkbill', { pwb_key: event.node.key }).then((v) => {
          body = Object.assign(body, {
            title: 'CPWRM',
            power: { Iscopy: true, IsUpdate: event.node.state != 0 ? false : true, wages: wages, flowpower: flowpower, mappower: mappower },
            node: {}
          })
          if (v) {
            body.title = 'PWRM';
            body.node = { key: v.popm_key, pwb_key: v.pwb_key, psi_key: event.node.psi_key, flowstate: true, state: event.node.state }
            // this._newflow.open(body)
            this._service.getModel('admin/OperationProcessMaster/', v.popm_key, (s) => {
              body.node = Object.assign({}, { key: s.key, name: s.name, is_back_flow: s.is_back_flow, pwb_key: v.pwb_key, psi_key: event.node.psi_key, flowstate: true, state: event.node.state })
              body.worksectionlist = s.worksectionlist;
              if (s.worksectionlist.length > 0) { body.node.bwi_key = s.worksectionlist[0].bwi_key }
              this._flow3.open(body);
            })
            // this._flow3.open(body)
          } else {
            // if (!opp_type || opp_type == 1) {
            if (event.node.state == 0) {
              body.isNull = true;
              this._flowLamination.open(body)
            } else {
              this.message.error(this.getTipsMsg('warning.noNewcreate'))
            }
            // } else {
            //   this.message.error('当前使用的是款式工序流，请到款式管理中修改工序流！')
            // }
          }
        })
        return
      case 'workClose':
        if (event.node.state != 2 && event.node.state != -1) { this.message.error(this.getTipsMsg('checkdata.check_workOrclose')); return; }
        this._modalService.confirm({
          nzTitle: this._appService.translate("confirm.confirmworkClose", event.node.state_name),
          nzContent: '',
          nzOnOk: () => {
            this._service.comPost(this.otherUrl.workClose, { key: event.node.key }).then((result) => {
              this._crud.reloadData(null)
              this.message.success(this.getTipsMsg('sucess.s_update'));
            }, (msg) => { this._crud.reloadData(null) });
          }
        });
        return;
      case 'return':
        this._flowLamination.open(event.node)
        return
      case 'copyset':
        this._flowLamination.open(event.node)
        return
    }
    super.btnEvent(event);
  }
  openModal(model: any) {
    let flowLaminbtn = AppConfig.btnGroup.single.find(sf => sf.action == "flowLamin") || AppConfig.btnGroup.extend.find(sf => sf.action == "flowLamin");
    let Flowbtn = AppConfig.btnGroup.single.find(sf => sf.action == "Flow") || AppConfig.btnGroup.extend.find(sf => sf.action == "Flow");
    model.isflowLamin = flowLaminbtn ? true : false
    model.isFlow = Flowbtn ? true : false
    this._edit.open(model)
  }
  handleOk(i) {
    this._setTags2.open({ title: 'tagbind', node: this.Visinode, tagmode: i });
    this.isVisible = false;
  }
  ngOnInit(): void {
    this._service.comList('Enum', { method: 'workstatus' }).then((v) => {
      this.options = v;
    })
  }
}
