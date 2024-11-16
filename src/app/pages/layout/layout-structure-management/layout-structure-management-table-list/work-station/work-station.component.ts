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
    selector: 'app-work-station',
    templateUrl: './work-station.component.html',
    styleUrls: ['./work-station.component.less'],
})
export class WorkStationComponent implements OnInit, OnChanges {
    @Input() key;
    workStationList: any[] = [];
    keywords;
    pageSize = 15;
    pageIndex = 1;
    total = 0;

    workStationSelectedList: any[] = [];
    keywords2;
    y = 'calc(100vh - 427px - 48px)';

    get workStationSelectedFilterList() {
        if (this.keywords2) {
            return this.workStationSelectedList.filter(
                (item) =>
                    item.poi_code.includes(this.keywords2) ||
                    item.poi_name.includes(this.keywords2)
            );
        } else {
            return this.workStationSelectedList;
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
            this.workStationList = [];
            this.workStationSelectedList = [];
        }
    }

    onQueryParamsChange(params) {
        const { pageIndex, pageSize } = params;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.fetchList();
    }

    fetchList() {
        const params = {
            orderdirection: 'ac',
            orderfield: 'code',
            display: true,
            page: this.pageIndex,
            pagesize: this.pageSize,
            keywords: this.keywords,
        };
        this.lsms.fetchWorkStationList(params).then((res: any) => {
            this.workStationList = res.data;
            this.total = res.total;
        });
    }

    fetchSelectedList() {
        const params = {
            bls_key: this.key,
            keywords: this.keywords2,
        };
        this.lsms.fetchSelectedWorkStationList(params).then((data: any) => {
            this.workStationSelectedList = data;
        });
    }

    onKeyUp() {
        this.pageIndex = 1;
        this.fetchList();
    }

    onKeyUp2(e) {
        this.keywords2 = e.target.value;
    }

    onAdd(record) {
        const params = {
            bls_key: this.key,
            display: true,
            mixtureratio: record.mixtureratio,
            poi_code: record.code,
            poi_key: record.key,
            poi_name: record.name,
        };

        this.lsms.adddWorkStation(params).then(() => {
            this.message.success(this.appService.translate('sucess.s_save'));
            this.keywords2 = '';
            this.fetchSelectedList();
        });
    }

    onDelete(record) {
        this.modal.confirm({
            nzTitle:
                this.appService.translate('confirm.confirm_deln') +
                record.poi_code,
            nzOnOk: () => {
                const params = [
                    {
                        key: record.key,
                    },
                ];
                this.lsms.deletedWorkStation(params).then(() => {
                    this.message.success(
                        this.appService.translate('sucess.s_delete')
                    );
                    this.keywords2 = '';
                    this.fetchSelectedList();
                });
            },
        });
    }

    onEditRatio(record) {
        const params = {
            bls_key: this.key,
            key: record.key,
            mixtureratio: record.mixtureratio,
            poi_key: record.poi_key,
        };

        this.lsms.adddWorkStation(params).then(() => {
            this.message.success(this.appService.translate('sucess.s_save'));
            this.keywords2 = '';
            this.fetchSelectedList();
        });
    }
}
