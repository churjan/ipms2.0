import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CrudComponent } from '~/shared/components/crud/crud.component';
import { AppService } from '~/shared/services/app.service';
import { AutoOutControlService } from '~/pages/warehouse/wms/autooutcontrol/autoOutControl.service';

@Component({
  selector: 'app-autooutcontrol',
  templateUrl: './autooutcontrol.component.html',
  styleUrls: ['./autooutcontrol.component.less']
})
export class AutooutcontrolComponent implements OnInit {

    @ViewChild('crud') crud: CrudComponent

    activeRow: any
    tableColumns: any[] = []

    constructor(
        public autoOutControlService: AutoOutControlService,
        private appService :AppService,
        private modal: NzModalService
    ) { }

    ngOnInit(){
        this.tableColumns = this.autoOutControlService.tableColumns()
    }

    startToChangeStatus($event,record){
        $event.stopPropagation()
        if(record.status == 2 || record.status == 99) return false //关闭、完成状态不允许再变更状态
        this.activeRow = JSON.parse(JSON.stringify(record))
    }

    changeStatus(){
        this.modal.confirm({
            nzTitle: this.appService.translate("confirmToUpdate"),
            nzMaskClosable: true,
            nzOnOk: () => {
                this.autoOutControlService.changeStatus(this.activeRow).then(() =>{
                    this.crud.loadDataFromServer()
                    this.activeRow = null
                })
            },
            nzOnCancel: () =>{
                this.activeRow = null
            }
        })  
    }

    crudClick($event){
        const path = $event.path || ($event.composedPath && $event.composedPath())
        const has = path.some(({className}) =>className 
            && typeof className == 'string' 
            && className.indexOf('status-options') >= 0)
        if(!has){
            this.activeRow = null
        }
    }

}
