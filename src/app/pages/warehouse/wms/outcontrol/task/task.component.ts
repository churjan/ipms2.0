import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CrudComponent } from '~/shared/components/crud/crud.component';
import { AppService } from '~/shared/services/app.service';
import { OutControlTaskService } from '~/pages/warehouse/wms/outtask/outControlTask.service';

@Component({
    selector: 'task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.less']
})
export class TaskComponent implements OnInit {

    @ViewChild('crud') crud: CrudComponent
    title: string = null
    queryParams: any = {}
    visible: boolean = false
    tableColumns: any[] = []

    constructor(
        public outControlTaskService: OutControlTaskService,
        private message: NzMessageService,
        private appService: AppService,
        private modal: NzModalService
    ) { }

    ngOnInit() {
        this.tableColumns = this.outControlTaskService.tableColumns()
    }


    open(record: any): void {
        this.title = record.name + "/" + this.appService.translate("btn.task")
        this.queryParams = { control_key: record.key }
        this.visible = true
    }


    close(): void {
        this.visible = false
    }

    changeStatus(item: any) {
        if ( item.state == 99) {//关闭、完成状态不允许再变更状态
            this.message.warning(this.appService.translate('autoOutControl.statusChangeWarn'))
            return false
        }
        this.modal.confirm({
            nzTitle: this.appService.translate("confirm.confirm_ToUpdate"),
            nzMaskClosable: true,
            nzOnOk: () => {
                const { key, state } = item
                const postData = {
                    key: key,
                    state: state
                }
                this.outControlTaskService.changeStatus(postData).then(() => {
                    this.crud.loadDataFromServer()
                })
            },
            nzOnCancel: () => {
                this.crud.loadDataFromServer()
            }
        })
    }
}
