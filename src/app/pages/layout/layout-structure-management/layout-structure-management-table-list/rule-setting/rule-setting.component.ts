import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { LayoutStructureManagementService } from '../../layout-structure-management.service';
import { AppService } from '~/shared/services/app.service';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RuleInfoComponent } from './rule-info/rule-info.component';
@Component({
    selector: 'app-rule-setting',
    templateUrl: './rule-setting.component.html',
    styleUrls: ['./rule-setting.component.less'],
})
export class RuleSettingComponent implements OnInit, OnChanges {
    @Input() key;
    ruleSettingList: any[] = [];
    keywords;
    ruleSettingSelectedList: any[] = [];
    keywords2;
    y = 'calc(100vh - 427px - 48px)';
    @ViewChild('ruleinfo', { static: false }) _ruleinfo: RuleInfoComponent;

    get ruleSettingSelectedFilterList() {
        if (this.keywords2) {
            return this.ruleSettingSelectedList.filter(
                (item) =>
                    item.blsr_code.includes(this.keywords2) ||
                    item.blsr_name.includes(this.keywords2)
            );
        } else {
            return this.ruleSettingSelectedList;
        }
    }
    constructor(
        private lsms: LayoutStructureManagementService,
        private appService: AppService,
        private message: NzMessageService,
        private modal: NzModalService
    ) { }

    ngOnInit(): void { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.key.currentValue) {
            this.fetchList();
            this.fetchSelectedList();
        } else {
            this.ruleSettingList = [];
            this.ruleSettingSelectedList = [];
        }
    }

    fetchList() {
        const params = {
            page: 1,
            pagesize: 99999,
            keywords: this.keywords,
        };
        this.lsms.fetchRuleSettingList(params).then((data: any) => {
            this.ruleSettingList = data;
        });
    }

    fetchSelectedList() {
        const params = {
            bls_key: this.key,
            keywords: this.keywords2,
        };
        this.lsms.fetchSelectedRuleSettingList(params).then((data: any) => {
            this.ruleSettingSelectedList = data;
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
            blsr_code: record.code,
            blsr_key: record.key,
            blsr_name: record.name,
        };

        this.lsms.addRuleSetting(params).then(() => {
            this.message.success(this.appService.translate('sucess.s_save'));
            this.keywords2 = '';
            this.fetchSelectedList();
        });
    }

    onDelete(record) {
        this.modal.confirm({
            nzTitle:
                this.appService.translate('confirm.confirm_deln') +
                record.blsr_name,
            nzOnOk: () => {
                const params = [
                    {
                        key: record.key,
                    },
                ];
                this.lsms.deleteRuleSetting(params).then(() => {
                    this.message.success(
                        this.appService.translate('sucess.s_delete')
                    );
                    this.keywords2 = '';
                    this.fetchSelectedList();
                });
            },
        });
    }
    openrule(data) {
        this._ruleinfo.open({ title: 'DetailsRuleScheme', node: data })
    }
}
