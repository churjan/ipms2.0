import {
    Component,
    OnInit,
    ViewChild,
    HostListener,
    AfterViewInit,
    OnDestroy,
} from '@angular/core';
import { StructureRuleParamService } from '../structure-rule-param.service';
import { EmbedModalService } from '~/shared/components/embed-modal/embed-modal.service';
import { AppService } from '~/shared/services/app.service';

import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';

@Component({
    selector: 'app-structure-rule-param-table-list',
    templateUrl: './structure-rule-param-table-list.component.html',
    styleUrls: ['./structure-rule-param-table-list.component.less'],
})
export class StructureRuleParamTableListComponent
    implements OnInit, AfterViewInit {
    @ViewChild('tableView') tableView;
    tableList: any[] = [];
    loading = false;
    tableHeight = 0;

    // 参数
    pageSize = 15;
    pageIndex = 1;
    total = 0;
    keywords = '';
    group = '';
    sortField = null;
    sortOrder = null;

    // 选择框
    checked = false;
    indeterminate = false;
    setOfCheckedId = new Set<string>();

    // 弹窗
    isShowEditModal = false;
    isShowViewModal = false;
    record = null;
    modalClose$;

    get columnList() {
        return this.srps.columnList;
    }

    constructor(
        public srps: StructureRuleParamService,
        private ems: EmbedModalService,
        private appService: AppService,
        private modal: NzModalService,
        private message: NzMessageService
    ) { }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.autoSize();
    }

    autoSize() {
        setTimeout(() => {
            this.tableHeight =
                this.tableView.nativeElement.clientHeight - 40 - (16 + 24 + 16);
        }, 10);
    }

    ngAfterViewInit(): void {
        this.autoSize();
    }

    updateCheckedSet(key, checked) {
        if (checked) {
            this.setOfCheckedId.add(key);
        } else {
            this.setOfCheckedId.delete(key);
        }
    }

    refreshCheckedStatus(): void {
        this.checked = this.tableList.every(({ key }) =>
            this.setOfCheckedId.has(key)
        );
        this.indeterminate =
            this.tableList.some(({ key }) => this.setOfCheckedId.has(key)) &&
            !this.checked;
    }

    onItemChecked(key, checked) {
        this.updateCheckedSet(key, checked);
        this.refreshCheckedStatus();
    }

    onAllChecked(checked) {
        this.tableList.forEach(({ key }) =>
            this.updateCheckedSet(key, checked)
        );
        this.refreshCheckedStatus();
    }

    ngOnInit(): void {
        this.modalClose$ = this.ems.modalClose$.subscribe((data) => {
            if (
                [
                    'app-edit-structure-rule-param',
                    'app-view-structure-rule-param',
                ].includes(data.type)
            ) {
                this.record = null;
                this.record = null;
                this.isShowEditModal = false;
                this.isShowViewModal = false;
                if (data.bool) {
                    this.fetchList();
                }
            }
        });
    }

    onKeyUp(e) {
        this.pageIndex = 1;
        this.fetchList();
    }

    onSearch() {
        this.pageIndex = 1;
        this.fetchList();
    }

    onReset() {
        this.keywords = '';
        this.group = '';
        this.pageIndex = 1;
        this.pageSize = 15;
        this.total = 0;
        this.keywords = '';
        this.sortField = null;
        this.sortOrder = null;

        this.fetchList();
    }

    fetchList() {
        this.loading = true;
        const params = this.getParams();
        this.srps
            .fetchList(params)
            .then((res: any) => {
                this.tableList = res.data;
                this.total = res.total;
            })
            .finally(() => {
                this.loading = false;
            });
    }

    getParams() {
        const params = {
            page: this.pageIndex,
            pageSize: this.pageSize,
            keywords: this.keywords,
            group: this.group,
            orderfield: this.sortField,
            orderdirection:
                this.sortOrder === 'ascend'
                    ? 'asc'
                    : this.sortOrder === 'descend'
                        ? 'desc'
                        : null,
        };

        return params;
    }

    onQueryParamsChange(params) {
        const { pageIndex, pageSize, sort } = params;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        const currentSort = sort.find((item) => item.value !== null);
        this.sortField = (currentSort && currentSort.key) || null;
        this.sortOrder = (currentSort && currentSort.value) || null;
        this.fetchList();
    }

    onShowEditModal(type, record?) {
        this.isShowEditModal = true;
        if (type === 'edit') {
            this.record = record;
        }
    }

    onShowviewModal(record) {
        this.isShowViewModal = true;
        this.record = record;
    }

    onDelete(record) {
        this.modal.confirm({
            nzTitle: `${this.appService.translate('confirm.confirm_deln')}${record.name
                }`,
            nzOnOk: () => {
                this.srps.delete([{ key: record.key }]).then(() => {
                    this.message.success(
                        this.appService.translate('sucess.s_delete')
                    );
                    this.fetchList();
                });
            },
        });
    }

    onMutilDelete() {
        const idArr = Array.from(this.setOfCheckedId);
        const titleArr = [];
        this.tableList.forEach((item) => {
            if (idArr.includes(item.key)) {
                titleArr.push(item.name);
            }
        });

        this.modal.confirm({
            nzTitle: `${this.appService.translate(
                'confirm.confirm_deln'
            )}${titleArr.join(',')}`,
            nzOnOk: () => {
                this.srps
                    .delete(idArr.map((item) => ({ key: item })))
                    .then(() => {
                        this.message.success(
                            this.appService.translate('sucess.s_delete')
                        );
                        this.fetchList();
                    });
            },
        });
    }

    onTableResize({ width }: NzResizeEvent, col: string): void {
        this.columnList.map(e => {
            if (e.name === col) {
                e.width = `${width}px`
            }
        })
    }
}
