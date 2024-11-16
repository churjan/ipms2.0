import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { StructureRuleSchemeService } from '~/pages/layout/structure-rule-scheme/structure-rule-scheme.service';
import { AppService } from '~/shared/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
@Component({
    selector: 'app-track-unselect-table',
    templateUrl: './track-unselect-table.component.html',
    styleUrls: ['./track-unselect-table.component.less'],
})
export class TrackUnselectTableComponent implements OnInit, OnDestroy {
    @Input() record
    key;
    tableList: any[] = [];
    keywords;
    trackTreeChange$;
    y = 'calc(100vh - 315px)';
    trackList: any[] = [];
    get tableFilterList() {
        if (this.keywords) {
            return this.tableList.filter(
                (item) =>
                    item.name.includes(this.keywords) ||
                    item.pcode.includes(this.keywords) ||
                    item.pname.includes(this.keywords) ||
                    item.pcode.includes(this.keywords)
            );
        } else {
            return this.tableList;
        }
    }

    constructor(private srss: StructureRuleSchemeService, private appService: AppService,
        private modal: NzModalService,
        private message: NzMessageService) { }

    ngOnInit(): void {
        this.trackTreeChange$ = this.srss.trackTreeChange$.subscribe((key) => {
            if (key) {
                this.key = key;
                this.fetchList()
            } else {
                this.tableList = [];
            }

        });
        let trackList$ = this.srss.trackList$.subscribe((data) => {
            this.trackList = data
            data.forEach(d => {
                this.tableList = this.tableList.filter(t => t.key != d.bls_key);
            })
        });
    }

    fetchList() {
        this.srss.fetchTrackList().then((data: any) => {
            const tableList: any[] = [];
            const station = data.filter((item) => item.pkey === this.key);
            if (station.length) {
                station.forEach((element) => {
                    const railentry = data.filter(
                        (item) => item.pkey === element.key
                    );
                    if (railentry.length) {
                        railentry.forEach((rail) => {
                            // if (rail.blst_key == '101010') {
                            if (rail.group == 'In') {
                                rail.pname = element.name;
                                rail.pcode = element.code;
                                tableList.push(rail);
                            }
                            // }
                        });
                    }
                });
            }
            this.tableList = tableList;
            this.trackList.forEach(d => {
                this.tableList = this.tableList.filter(t => t.key != d.bls_key);
            })
        });
    }

    ngOnDestroy(): void {
        this.trackTreeChange$.unsubscribe();
    }

    onKeyUp(e) {
        this.keywords = e.target.value;
    }

    onAdd(record) {
        const params = {
            bls_code: record.code,
            bls_key: record.key,
            bls_name: record.name,
            Group: record.Group,
            blsr_code: this.record.code,
            blsr_key: this.record.key,
            blsr_name: this.record.name,
            display: true
        };

        this.srss.addTrack(params).then(() => {
            this.message.success(this.appService.translate('sucess.s_save'));
            this.srss.trackUnselectChange$.next()
        }).finally();
    }
}
