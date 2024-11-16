import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OutControlService } from '~/pages/warehouse/wms/outcontrol/outControl.service';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { PlanEditComponent } from './planedit/planedit.component';
import { PlanLookComponent } from './planlook/planlook.component';

@Component({
    selector: 'app-outboundplan',
    templateUrl: './outboundplan.component.html',
    styleUrls: ['./outboundplan.component.less']
})
export class OutboundPlanComponent extends ListTemplateComponent {

    constructor(
        public outControlService: OutControlService,
        public router: Router,
    ) {
        super()
        this.modularInit("wmsOutboundplan", router.url);
    }
    @ViewChild('crud', { static: false }) _crud: CrudComponent;
    @ViewChild('edit', { static: false }) _edit: PlanEditComponent;
    @ViewChild('look', { static: false }) _look: PlanLookComponent;
    statelist: any[] = [];


    ngOnInit() {
        // this.tableColumns = this.outControlService.tableColumns()
        this._service.enumList('warehouseoutboundplanenum').then((result) => { this.statelist = result; });
    }
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
            this.message.warning(this.getTipsMsg('autoOutControl.statusChangeWarn'))
            return false
        }
        this._modalService.confirm({
            nzTitle: this._appService.translate("confirm.confirmworkClose", item.state_name),
            nzContent: '',
            nzOnOk: () => {
                this._service.comPost(this.otherUrl.updataurl, { key: item.key, state: item.state }).then((result) => {
                    this._crud.reloadData(null)
                    this.message.success(this.getTipsMsg('sucess.s_update'));
                }, (msg) => { this._crud.reloadData(null) });
            },
            nzOnCancel: () => { this._crud.reloadData(null) },
        });
    }
}
