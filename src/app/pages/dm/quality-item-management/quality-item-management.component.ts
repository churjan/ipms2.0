import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { ClassZtreeComponent } from '~/shared/common/tree/class-ztree.component';
import { EditQualityItemManagementCatalogComponent } from './edit-quality-item-management-catalog/edit-quality-item-management-catalog.component';
import { EditQualityItemManagementComponent } from './edit-quality-item-management/edit-quality-item-management.component';
import { QualityWithProcessComponent } from './quality-with-process/quality-with-process.component';
import { ViewQualityItemManagementComponent } from './view-quality-item-management/view-quality-item-management.component';

@Component({
  selector: 'app-quality-item-management',
  templateUrl: './quality-item-management.component.html',
  styleUrls: ['./quality-item-management.component.less']
})
export class QualityItemManagementComponent extends ListTemplateComponent {

  constructor(public router: Router) {
    super();
    this.modularInit("basQuality");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
  @ViewChild('crud', { static: false }) _crud: CrudComponent;
  @ViewChild('edit', { static: false }) _edit: EditQualityItemManagementComponent;
  @ViewChild('view', { static: false }) _view: ViewQualityItemManagementComponent;
  @ViewChild('process', { static: false }) _process: QualityWithProcessComponent;
  @ViewChild('classEdit', { static: false }) _Classedit: EditQualityItemManagementCatalogComponent;
  @ViewChild('Menu', { static: false }) _Menu: ClassZtreeComponent;

  btnEvent(event) {
    switch (event.action) {
      case 'Look':
        this._view.open({ title: 'see', node: event.node })
        return;
      case 'operation':
        this._process.open({ title: 'placard.qualityWithProcess', node: event.node })
        break;
      case 'Set':
        return;
    }
    super.btnEvent(event);
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
  onclick(ev) {
    if (ev) { this._crud.SearchModel.bqcc_key = ev.key; } else {
      this._crud.SearchModel.bqcc_key = '';
    }
    this._crud.Search()
  }
  openModal(model: any) {
    this._edit.open(model)
  }
  succsave(event) {
    this._crud.reloadData(event);
    this._Menu.ResetTree();
  }
}
