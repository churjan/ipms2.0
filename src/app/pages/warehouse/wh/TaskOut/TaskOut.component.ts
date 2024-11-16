import { Component, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { ListTemplateComponent } from "~/shared/common/base/list-template.component";
import { CrudComponent } from "~/shared/common/crud/crud.component";
import { LookComponent } from "./look/look.component";
import { TaskOutEditComponent } from "./TaskOutEdit/TaskOutEdit.component";

@Component({
    selector: 'ina-TaskOut',
    templateUrl: './TaskOut.component.html',
    styleUrls: ['./TaskOut.component.less']
})
export class TaskOutComponent extends ListTemplateComponent {
    constructor(public router: Router, private fb: FormBuilder,) {
        super();
        this.modularInit("whTaskOut", router.url);
        this._service.enumList('warehousetaskoutenum').then((v) => {
            this.warehousetaskoutenum = v;
        })
    }
    @ViewChild('crud', { static: false }) _crud: CrudComponent;
    @ViewChild('edit', { static: false }) _edit: TaskOutEditComponent;
    @ViewChild('look', { static: false }) _look: LookComponent;
    warehousetaskoutenum: any[] = [];
    btnEvent(event) {
        switch (event.action) {
            case 'look':
                this._look.open({ title: 'see', node: event.node, seach: this._crud['SearchModel'] })
                break;
            default:
                break;
        }
        super.btnEvent(event);
    }
    openModal(model: any) {
        this._edit.open(model)
    }
    changeStatus(item: any) {
        if (item.state == 99) {//关闭、完成状态不允许再变更状态
            this.message.error(this.getTipsMsg('warning.statusChangeWarn'))
            return false
        }
        this.Confirm('confirm.confirm_setup', '', (confirmType) => {
            if (confirmType == 'pass') {
                const { key, state } = item
                const postData = {
                    key: key,
                    state: state
                }
                this._service.comPost(this.modular.url + "extend/changestatus", postData).then((data) => {
                    this.message.success(this.getTipsMsg('sucess.s_set'))
                    this.GetList();
                });
            } else {
                this.GetList();
            }
        })
    }
}