import { Component, OnInit,OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { CommonService } from '~/shared/services/http/common.service';
import { PackingSolutionDetailComponent } from './packing-solution-detail/packing-solution-detail.component';
import { PackingSolutionService } from './packing-solution.service';
import { AppService } from '~/shared/services/app.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '~/global';
import { EmbedModalService } from '~/shared/components/embed-modal/embed-modal.service';


@Component({
    selector: 'app-packing-solution',
    templateUrl: './packing-solution.component.html',
    styleUrls: ['./packing-solution.component.less'],
})
export class PackingSolutionComponent extends ListTemplateComponent implements OnInit, OnDestroy {
    @ViewChild('crud', { static: false }) crud: CrudComponent;
    @ViewChild('detailComponent', { static: false })
    detailComponent: PackingSolutionDetailComponent;
    statusAuth = -1;
    levelAuth = -1;

    levelList = [];
    statusList = [];

    // 弹窗
    modalClose$;
    isVisible = false;
    record = null;
    

    formatNumber(value) {
        if (Math.floor(value) === value) {
            return Math.floor(value);
        } else {
            return value.toFixed(2);
        }
    }

    progressFormatFn = (record, symbol = '') => {
        const progress = Number(
            (record.online_quantity / record.quantity) * 100
        );
        return this.formatNumber(progress) + symbol;
    };

    constructor(
        public router: Router,
        private commonService: CommonService,
        private pss: PackingSolutionService,
        private appService: AppService,
        private modal: NzModalService,
        private global: GlobalService,
        private ems: EmbedModalService
    ) {
        super();
        this.modularInit('wmsPackingsolution');
        this.url = router.url.replace(/^\//, '').replace(/\//g, '_');
    }

    ngOnInit(): void {
        this.fetchLevelEnum();
        this.fetchStatusEnum();
        if (this.global.munuList.length > 0) {
            const rawbtnGroup = this._authService.getBtnZAll(
                this.global.munuList,
                'wms_packingsolution'
            );
            this.statusAuth = rawbtnGroup.special.findIndex(
                (item) => item.action === 'status'
            );
            this.levelAuth = rawbtnGroup.special.findIndex(
                (item) => item.action === 'level'
            );
        }

        this.modalClose$ = this.ems.modalClose$.subscribe((data) => {
            // console.log(data);
            if (['app-packing-solution-sort'].includes(data.type)) {
              this.record = null;
              this.isVisible = false;
              if(data.bool){
                this.crud.reloadData(true);
              }
            }
          });
    }

    ngOnDestroy(): void {
        this.modalClose$.unsubscribe();
      }

    btnEvent(event) {
        // console.log(666, event);
        switch (event.action) {
            case 'Look':
                this.detailComponent.open({
                    title: 'see',
                    node: event.node,
                    seach: this.crud['SearchModel'],
                });
                break;
            case 'makeout':
                this.modal.confirm({
                    nzTitle: '确定要手动出库吗？',
                    nzOnOk: () => {
                        this.pss
                            .confirmMakeout({ key: event.node.key })
                            .then(() => {
                                this.message.success(
                                    this.getTipsMsg('sucess.s_action')
                                );
                                this.crud.Search();
                            });
                    },
                });
            break;
            case 'sort':
                this.isVisible = true;
                break;
            default:
                break;
        }
        super.btnEvent(event);
    }

    fetchLevelEnum() {
        this.commonService
            .enum('warehouseoutboundplanlevelenum')
            .then((data: any[]) => {
                this.levelList = data;
            });
    }

    fetchStatusEnum() {
        this.commonService
            .dictionary('packingsolutionstatus')
            .then((data: any[]) => {
                data.forEach((item) => (item.code = Number(item.code)));
                data.sort((a, b) => a.code - b.code);
                this.statusList = data;
            });
    }

    onChangeLevel(record) {
        this._modalService.confirm({
            nzTitle: this._appService.translate(
                'confirm.confirmworkClose',
                record.level_name
            ),
            nzContent: '',
            nzOnOk: () => {
                const params = {
                    key: record.key,
                    level: record.level,
                };

                this.pss.modifyLevel(params).then(() => {
                    this.crud.reloadData(null);
                    this.message.success(this.getTipsMsg('sucess.s_update'));
                });
            },
        });
    }

    onChangeStatus(record) {
        this._modalService.confirm({
            nzTitle: this._appService.translate(
                'confirm.confirmworkClose',
                record.state_name
            ),
            nzContent: '',
            nzOnOk: () => {
                const params = {
                    key: record.key,
                    state: record.state,
                };

                this.pss.modifyStatus(params).then(() => {
                    this.crud.reloadData(null);
                    this.message.success(this.getTipsMsg('sucess.s_update'));
                });
            },
        });
    }
}
