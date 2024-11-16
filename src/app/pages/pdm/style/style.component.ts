import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { ClassEditComponent } from './classEdit/classEdit.component';
import { EditComponent } from './edit/edit.component';
import { FilesComponent } from './files/files.component';
declare var $: any;
import { StyleFlowComponent } from './styleFlow/styleFlow.component';
import { StyleLookComponent } from './look/stylelook.component';
import { ClassZtreeComponent } from '~/shared/common/tree/class-ztree.component';
import { ImpComponent } from '~/shared/common/imp/imp.component';
@Component({
  selector: 'app-style',
  templateUrl: './style.component.html',
  styleUrls: ['./style.component.less']
})
export class StyleComponent extends ListTemplateComponent {

  @ViewChild('edit', { static: false }) _edit: EditComponent;
  @ViewChild('crud', { static: false }) _crud: CrudComponent;
  @ViewChild('classEdit', { static: false }) _Classedit: ClassEditComponent;
  @ViewChild('files', { static: false }) _files: FilesComponent;
  @ViewChild('flow', { static: false }) _flow: StyleFlowComponent;
  @ViewChild('flownew', { static: false }) _flownew: StyleFlowComponent;
  @ViewChild('stylelook', { static: false }) _stylelook: StyleLookComponent;
  @ViewChild('Menu', { static: false }) _Menu: ClassZtreeComponent;
  @ViewChild('StyleWorkbill', { static: false }) _StyleWorkbill: ImpComponent;
  isRenew: boolean = false;
  constructor(public router: Router) {
    super();
    this.modularInit("pdmStyle");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
  issearch: boolean = false;
  psc: string = '';

  ngOnInit(): void { }

  openModal(model: any) {
    this._edit.open(model)
  }
  btnEvent(event) {
    let flowpower = sessionStorage.process && sessionStorage.process == 'true' ? true : false;
    let mappower = sessionStorage.processroute && sessionStorage.processroute == 'true' ? true : false;
    let wages = sessionStorage.havewages && sessionStorage.havewages == 'true' ? true : false;
    switch (event.action) {
      case 'drawing':
        this._files.open({ title: 'tuzhi', node: event.node })
        return;
      case 'oplist':
        this._flow.open({ title: 'PWRM', btnaction: event.sonbtn ? event.sonbtn : {}, node: event.node, type: 'S', power: { Iscopy: false, IsUpdate: true, flowpower: flowpower, mappower: mappower, wages: wages } })
        return;
      case 'oplistnew':
        this._flownew.open({ title: 'PWRM', btnaction: event.sonbtn ? event.sonbtn : {}, node: event.node, type: 'S', power: { Iscopy: false, IsUpdate: true, flowpower: flowpower, mappower: mappower, wages: wages } })
        return;
      case 'commoplist':
        this._flow.open({ title: 'commflow', btnaction: event.sonbtn ? event.sonbtn : {}, node: {}, type: 'S', power: { Iscopy: false, IsUpdate: true, flowpower: flowpower, mappower: mappower, wages: wages, ispublic: true } })
        return;
      case 'Look':
        this._stylelook.open({ title: 'btn.see', node: event.node, type: 'S', power: { Iscopy: false, IsUpdate: true, flowpower: flowpower, mappower: mappower, ispublic: true } })
        return;
      case 'StyleOp':

        return;
      case 'ImpBatch':
        this._StyleWorkbill.open({ title: 'import' })
        return;
    }
    super.btnEvent(event);
  }
  onclick(ev) {
    if (ev) { this._crud.SearchModel.psc_key = ev.key; } else {
      this._crud.SearchModel.psc_key = '';
    }
    this._crud.Search()
  }
  onAction(ev) {
    switch (ev.action) {
      case 'add':
        this._Classedit.open({ title: 'add', node: { pkey: ev.node ? ev.node.key : '' } });
        return;
      case 'update':
        this._Classedit.open({ title: 'update', node: ev.node });
        return;
    }
  }
  succsave(event) {
    this._crud.reloadData(event);
    this._Menu.ResetTree();
  }
  renew() {
    this._service.comList('WorkSectionInfo/Extend', {}, 'GetMyWorkSectionInfo/').then(v => {
      this.isRenew = true;
      sessionStorage.setItem('bwi_list', JSON.stringify(v))
    })
  }
}
