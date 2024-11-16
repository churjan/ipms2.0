import { Component, Input, OnInit } from '@angular/core';

import { AppService } from '~/shared/services/app.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NzModalService } from 'ng-zorro-antd/modal';
import { QualityItemManagementService } from '../quality-item-management.service';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
@Component({
    selector: 'app-quality-with-process',
    templateUrl: './quality-with-process.component.html',
    styleUrls: ['./quality-with-process.component.less'],
})
export class QualityWithProcessComponent extends FormTemplateComponent {
    @Input() record;
    selectedValue;
    qualityList: any[] = [];

    tableList: any[] = [];
    keywords;
    tableSelectedList: any[] = [];
    keywords2;
    y = 'calc(100vh -300px)';

    get tableFilterSelectedList() {
        if (this.keywords2) {
            return this.tableSelectedList.filter(
                (item) =>
                    item.blsr_code.includes(this.keywords2) ||
                    item.blsr_name.includes(this.keywords2)
            );
        } else {
            return this.tableSelectedList;
        }
    }
    constructor(
        private qims: QualityItemManagementService,
        private breakpointObserver: BreakpointObserver,
        private appService: AppService,
        private modal: NzModalService
    ) { super() }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '40rem'
            } else {
                this.width = '100%'
            }
        })
    }


    async open(record: any) {
        this.title = this._appService.translate(record.title)
        this.fetchQualityList();
        this.fetchList();
        if (record.node) {
            this.key = record.node.key
            if (this.key) {
                this.selectedValue = this.key;
                // this.fetchList();
            }
        } else {
            this.key = null
        }
        this.visible = true
    }
    onSelectChange() {
        this.fetchSelectedList();
    }

    fetchQualityList() {
        this.qims.fetchQualityList().then((res: any) => {
            this.qualityList = res.data;
            this.selectedValue = this.key ? this.key : this.qualityList[0]?.key;
            this.fetchSelectedList();
        });
    }

    fetchList() {
        const params = {
            keywords: this.keywords,
        };
        this.qims.fetchOperationList(params).then((data: any) => {
            this.tableList = data;
        });
    }
    fetchSelectedList() {
        this.qims
            .fetchSelectedOperationList(this.selectedValue)
            .then((data: any) => {
                this.tableSelectedList = data;
            });
    }

    onKeyUp() {
        this.fetchList();
    }

    onKeyUp2(e) {
        this.keywords2 = e.target.value;
    }

    onAdd(record) {
        const flag = this.tableSelectedList.find(item => item.poc_key === record.key)
        if (flag) {
            this.message.error(
                this.appService.translate('warning.alreadyset')
            );
            return
        }
        const params = {
            bqci_key: this.selectedValue,
            display: true,
            poc_key: record.key,
        };

        this.qims.addSetting(params).then(() => {
            this.message.success(this.appService.translate('sucess.s_save'));
            this.keywords2 = '';
            this.fetchSelectedList();
        });
    }

    onDelete(record) {
        this.modal.confirm({
            nzTitle:
                this.appService.translate('confirm.confirm_deln') +
                record.poc_name,
            nzOnOk: () => {
                const params = [
                    {
                        key: record.key,
                    },
                ];
                this.qims.deleteSetting(params).then(() => {
                    this.message.success(
                        this.appService.translate('sucess.s_delete')
                    );
                    this.keywords2 = '';
                    this.fetchSelectedList();
                });
            },
        });
    }

    close(): void {
        this.submiting = false;
        this.avatar = null
        this.visible = false
    }
}
