import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { ClassEditComponent } from './classEdit/classEdit.component';
import { EditComponent } from './edit/edit.component';
import { FilesComponent } from './files/files.component';
import { PairComponent } from './pair/pair.component';
import { ToolsComponent } from './tools/tools.component';
import { WebsiteComponent } from './website/website.component';
import { ClassZtreeComponent } from '~/shared/common/tree/class-ztree.component';
import { OperationLookComponent } from './look/operationlook.component';
declare var $: any;
@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.css']
})
export class OperationComponent extends ListTemplateComponent {
  @ViewChild('crud', { static: false }) _crud: CrudComponent;
  @ViewChild('edit', { static: false }) _edit: EditComponent;
  @ViewChild('classEdit', { static: false }) _classEdit: ClassEditComponent;
  @ViewChild('files', { static: false }) _files: FilesComponent;
  @ViewChild('tools', { static: false }) _tools: ToolsComponent;
  @ViewChild('pair', { static: false }) _pair: PairComponent;
  @ViewChild('website', { static: false }) _website: WebsiteComponent;
  @ViewChild('Menu', { static: false }) _Menu: ClassZtreeComponent;
  @ViewChild('operationlook', { static: false }) _operationlook: OperationLookComponent;

  constructor(public router: Router, private fb: FormBuilder,) {
    super(); this.modularInit("pdmOperation");
    this.url = router.url.replace(/\//g, "_")
    if (this.url.indexOf("_") == 0) {
      this.url = this.url.substring(1, this.url.length)
    }
  }
  multikey: string = '';
  isReset: boolean;
  issearch: boolean = false;
  btnEvent(event) {
    switch (event.action) {
      case 'Look':
        this._operationlook.open({ title: 'see', node: event.node })
        return;
      case 'Files':
        this._files.open({ title: 'opfiles', node: event.node })
        return;
      case 'Tool':
        this._tools.open({ title: 'tool', node: event.node })
        return;
      case 'Website':
        this._website.open({ title: 'Website', node: event.node })
        return;
      case 'Pairing':
        this._pair.open({ title: 'Pairing', node: event.node })
        return;
    }
    super.btnEvent(event);
  }
  openModal(model: any) {
    this._edit.open(model)
  }
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      code: [null],
      name: [null],
      style: [null]
    })
  }
  Search(ev?) {
    this.seniorModel.start_time_start =
      this.dateFormat(this.seniorModel.start_time_start, 'yyyy-MM-dd');
    this.seniorModel.start_time_end =
      this.dateFormat(this.seniorModel.start_time_end, 'yyyy-MM-dd');
    this.seniorModel.create_time_start =
      this.dateFormat(this.seniorModel.create_time_start, 'yyyy-MM-dd');
    this.seniorModel.create_time_end =
      this.dateFormat(this.seniorModel.create_time_end, 'yyyy-MM-dd');
    super.Search(ev)
  }
  Delete() {
    let checklist = this.list.filter(l => l.checked == true);
    if (checklist && checklist.length == 1 && checklist.find(c => c.state != 0 && c.state != 1)) {
      this.message.error(this._appService.translate('warning.nonewbuild'))
      return
    }
    super.Delete();
  }
  onclick(ev) {
    if (ev) { this._crud.SearchModel.poc_key = ev.key; } else {
      this._crud.SearchModel.poc_key = '';
    }
    this._crud.Search()
  }
  onAction(event) {
    if (event) {
      switch (event.action) {
        case 'add':
          this._classEdit.open({ title: 'add', node: { pkey: event.node && event.node.key ? event.node.key : '' } })
          break;
        case 'update':
          this._classEdit.open({ title: 'update', node: event.node })
          break;
        default:
          break;
      }
    }
  }
}
