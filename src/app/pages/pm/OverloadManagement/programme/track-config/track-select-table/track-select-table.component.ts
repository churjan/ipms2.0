import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { StructureRuleSchemeService } from '~/pages/layout/structure-rule-scheme/structure-rule-scheme.service';
import { AppService } from '~/shared/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
@Component({
    selector: 'app-track-select-table',
    templateUrl: './track-select-table.component.html',
    styleUrls: ['./track-select-table.component.less'],
})
export class TrackSelectTableComponent implements OnInit, OnDestroy {
    @Input() record;
    key;
    tableList: any[] = [];
    keywords;
    trackUnselectChange$;
    y = 'calc(100vh - 315px)';

    get tableFilterList() {
        if (this.keywords) {
            return this.tableList.filter(
                (item) =>
                    item.bls_code.includes(this.keywords) ||
                    item.bls_name.includes(this.keywords)
            );
        } else {
            return this.tableList;
        }
    }

    constructor(
        private srss: StructureRuleSchemeService,
        private appService: AppService,
        private modal: NzModalService,
        private message: NzMessageService
    ) {}

    ngOnInit(): void {
        this.fetchList();
        this.trackUnselectChange$ = this.srss.trackUnselectChange$.subscribe(() => {
                this.keywords = '';
                this.fetchList();
            }
        );
    }

    fetchList() {
        this.srss.fetchSelectedTrackList(this.record.key).then((data: any) => {
            this.tableList = data;
            this.srss. trackList$.next(data)
        });
    }

    onDelete(record) {
        this.modal.confirm({
            nzTitle:
                this.appService.translate('confirm.confirm_deln') +
                record.bls_name,
            nzOnOk: () => {
                const params = [
                    {
                        key: record.key,
                    },
                ];
                this.srss.deleteTrack(params).then(() => {
                    this.message.success(
                        this.appService.translate('sucess.s_delete')
                    );
                    this.keywords = '';
                    this.fetchList();
                });
            },
        });
    }

    ngOnDestroy(): void {
        this.trackUnselectChange$.unsubscribe();
    }

    onKeyUp(e) {
        this.keywords = e.target.value;
    }
}
