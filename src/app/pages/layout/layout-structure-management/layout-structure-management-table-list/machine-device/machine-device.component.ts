import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { LayoutStructureManagementService } from '../../layout-structure-management.service';
import { AppService } from '~/shared/services/app.service';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-machine-device',
    templateUrl: './machine-device.component.html',
    styleUrls: ['./machine-device.component.less'],
})
export class MachineDeviceComponent implements OnInit, OnChanges {
    @Input() key;
    machineList: any[] = [];
    keywords;
    machineSelectedList: any[] = [];
    keywords2;
    y = 'calc(100vh - 427px - 48px)';

    get machineSelectedFilterList() {
        if (this.keywords2) {
            return this.machineSelectedList.filter(
                (item) =>
                    item.dmdi_code.includes(this.keywords2) ||
                    item.dmdi_name.includes(this.keywords2)
            );
        } else {
            return this.machineSelectedList;
        }
    }

    constructor(
        private lsms: LayoutStructureManagementService,
        private appService: AppService,
        private message: NzMessageService,
        private modal: NzModalService
    ) {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.key.currentValue) {
            this.fetchList();
            this.fetchSelectedList();
        } else {
            this.machineList = [];
            this.machineSelectedList = [];
        }
    }

    fetchList() {
        const params = {
            page: 1,
            pagesize: 99999,
            keywords: this.keywords,
        };
        this.lsms.fetchMachineDeviceList(params).then((res: any) => {
            this.machineList = res.data;
        });
    }

    fetchSelectedList() {
        const params = {
            bls_key: this.key,
            keywords: this.keywords2,
        };
        this.lsms.fetchSelectedMachineDeviceList(params).then((data: any) => {
            this.machineSelectedList = data;
        });
    }

    onKeyUp() {
        this.fetchList();
    }

    onKeyUp2(e) {
        this.keywords2 = e.target.value;
    }

    onAdd(record) {
        const params = {
            bls_key: this.key,
            display: true,
            dmdi_code: record.code,
            dmdi_key: record.key,
            dmdi_name: record.name,
        };

        this.lsms.addMachineDevice(params).then(() => {
            this.message.success(this.appService.translate('sucess.s_save'));
            this.keywords2 = '';
            this.fetchSelectedList();
        });
    }

    onDelete(record) {
        this.modal.confirm({
            nzTitle: this.appService.translate('confirm.confirm_deln')+record.dmdi_name,
            nzOnOk: () => {
                const params = [
                    {
                        key: record.key,
                    },
                ];
                this.lsms.deleteMachineDevice(params).then(() => {
                    this.message.success(
                        this.appService.translate('sucess.s_delete')
                    );
                    this.keywords2 = '';
                    this.fetchSelectedList();
                });
            },
        });
    }
}
