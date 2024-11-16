import { Component, OnInit } from '@angular/core';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { PackingSolutionService } from '../../packing-solution.service';
import { WmsStationService } from '~/shared/services/wms-station.service';

@Component({
    selector: 'app-print-modal',
    templateUrl: './print-modal.component.html',
    styleUrls: ['./print-modal.component.less'],
})
export class PrintModalComponent extends FormTemplateComponent {
    record = null;
    isBtnLoading = false;

    constructor(
        private pss: PackingSolutionService,
        public wss: WmsStationService
    ) {
        super();
    }

    compareFn = (o1: any, o2: any): boolean =>
        o1 && o2 ? o1.key === o2.key : o1 === o2;

    ngOnInit(): void {
        if (!this.wss.stationList.length) {
            this.wss.fetchStation();
        }
    }

    onStationChange() {
        sessionStorage.setItem(
            'wms_curStation',
            JSON.stringify(this.wss.curStation)
        );
    }

    async open(record) {
        this.record = record;
        this.title = record.title;
        this.visible = true;
    }

    close(): void {
        this.visible = false;
    }

    onPrint() {
        this.isBtnLoading = true;
        let FnName = null;
        let params = null;
        if (this.record.type === 'suit') {
            FnName = 'printSuit';
            params = {
                bls_key: this.wss.curStation.key,
                zhuangxinfenzu: this.record.item.zhuangxinfenzu,
                tiaoma: this.record.item.tiaoma,
            };
        } else if (this.record.type === 'box') {
            FnName = 'printBox';
            params = {
                bls_key: this.wss.curStation.key,
                zhuangxinfenzu: this.record.item.zhuangxinfenzu,
                expr1: this.record.item.expr1,
            };
        }

        this.pss[FnName](params).then(() => {
            this.message.success('打印成功！');
            this.isBtnLoading = false;
            this.visible = false;
        });
    }
}
