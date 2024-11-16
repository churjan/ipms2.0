import { Component, OnInit, Input } from '@angular/core';

import { AppService } from '~/shared/services/app.service';
import { ProgrammeService } from '~/shared/services/http/programme.service';

import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
    TransferChange,
    TransferItem,
    TransferSelectChange,
} from 'ng-zorro-antd/transfer';

@Component({
    selector: 'app-position-transfer',
    templateUrl: './position-transfer.component.html',
    styleUrls: ['./position-transfer.component.less'],
})
export class PositionTransferComponent implements OnInit {
    @Input() record;
    $asTransferItems = (data: unknown): TransferItem[] =>
        data as TransferItem[];
    list: any[] = [];
    constructor(
        private appService :AppService,
        public pgs: ProgrammeService,
        private modalRef: NzModalRef,
        private message: NzMessageService
    ) {}

    ngOnInit(): void {
       this.fetchList()
    }

    fetchList(){
         // bls_key  站位
        // bssi_key 规则
        const promise1 = this.fetchAllStationList();
        const promise2 = this.fetchSelectedStationList();
        Promise.all([promise1, promise2]).then((values: any) => {
            const [allList, selectedList] = values;
            const list: any[] = [];
            allList.forEach((item) => {
                const result = selectedList.find(
                    (item2) => item2.bls_code === item.code
                );
                const direction = result ? 'right' : 'left';
                const record = {
                    title: item.name,
                    direction: direction,
                    key: result?result.key:item.key,
                    code:item.code
                };
                list.push(record);
            });
            this.list = list;
        });
    }

    onClose() {
        this.modalRef.destroy(false);
    }

    onSubmit() {
        this.modalRef.destroy(true);
    }

    change(ret: any) {
        if (ret.from === 'left' && ret.to === 'right') {
            const bls_keys = ret.list.map((item) => item.key);
            const params = {
                bls_keys,
                bssi_key: this.record.key,
            };
            this.pgs.addStationList(params).then(()=>{
                this.message.success(this.appService.translate("operationSuccess"))
                this.fetchList()
            })
        } else {
            const key = ret.list.map((item) => ({key:item.key}));
            const params = key
            this.pgs.deleteStationList(params).then(()=>{
                this.message.success(this.appService.translate("operationSuccess"))
                this.fetchList()
            })
        }
    }

    fetchAllStationList() {
        return this.pgs.fetchAllStationList({});
    }

    fetchSelectedStationList() {
        const params = {
            bssi_key: this.record.key,
        };
        return this.pgs.fetchSelectedStationList(params);
    }

    filterOption(inputValue: string, item: any): boolean {
        return (
            item.title.indexOf(inputValue) > -1 ||
            item.code.indexOf(inputValue) > -1
        );
    }
}
