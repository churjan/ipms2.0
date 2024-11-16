import {
    Component,
    OnInit,
    ViewChild,
    HostListener,
    AfterViewInit,
    OnDestroy,
} from '@angular/core';

import { DocLibraryService } from '../doc-library.service';
import { EmbedDrawerService } from '~/shared/components/embed-drawer/embed-drawer.service';
import { AppService } from '~/shared/services/app.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '@/environments/environment';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
@Component({
    selector: 'app-doc-library-table-list',
    templateUrl: './doc-library-table-list.component.html',
    styleUrls: ['./doc-library-table-list.component.less'],
})
export class DocLibraryTableListComponent
    implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('tableView') tableView;
    tableList: any[] = [];
    loading = false;
    tableHeight = 0;

    // 参数
    pageSize = 15;
    pageIndex = 1;
    total = 0;
    keywords = '';
    sortField = null;
    sortOrder = null;

    // 选择框
    checked = false;
    indeterminate = false;
    setOfCheckedId = new Set<string>();

    // 高级搜索
    isAdvance = true;
    advanceParams = {};

    //弹窗
    drawerClose$;
    isShowAdvancedSearch = false;

    get columnList() {
        return this.dls.columnList;
    }

    isChecked(column) {
        return column.find((item) => item.code === 'checked');
    }

    constructor(
        public dls: DocLibraryService,
        private eds: EmbedDrawerService,
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
        this.drawerClose$ = this.eds.drawerClose$.subscribe((value) => {
            if (value == false)
                this.isShowAdvancedSearch = false;
            if (value) {
                this.advanceParams = value;
                this.fetchList();
            }
        });
    }

    ngOnDestroy(): void {
        this.drawerClose$.unsubscribe();
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
        this.pageIndex = 1;
        this.pageSize = 15;
        this.total = 0;
        this.keywords = '';
        this.sortField = null;
        this.sortOrder = null;

        //高级搜索
        if (this.isAdvance) {
            this.advanceParams = {};
        }

        this.fetchList();
    }

    fetchList() {
        this.loading = true;
        const params = this.getParams();
        this.dls
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
            orderfield: this.sortField,
            orderdirection:
                this.sortOrder === 'ascend'
                    ? 'asc'
                    : this.sortOrder === 'descend'
                        ? 'desc'
                        : null,
            ...(this.isAdvance ? this.advanceParams : {}),
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

    onAdvancedSearch() {
        this.isShowAdvancedSearch = !this.isShowAdvancedSearch
    }

    onDelete(record) {
        this.modal.confirm({
            nzTitle: `${this.appService.translate('confirm.confirm_deln')}${record.originalname
                }`,
            nzOnOk: () => {
                this.dls.delete([{ key: record.key }]).then(() => {
                    this.message.success(
                        this.appService.translate('sucess.s_delete')
                    );
                    this.fetchList();
                });
            },
        });
    }

    onMutilDelete() {
        if (this.setOfCheckedId.size === 0) {
            this.message.warning(
                this.appService.translate('checkdata.check_leastoneledata')
            );
            return
        }
        const idArr = Array.from(this.setOfCheckedId);
        const titleArr = [];
        this.tableList.forEach((item) => {
            if (idArr.includes(item.key)) {
                titleArr.push(item.originalname);
            }
        });

        this.modal.confirm({
            nzTitle: `${this.appService.translate(
                'confirm.confirm_deln'
            )}${titleArr.join(',')}`,
            nzOnOk: () => {
                this.dls
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

    onPreview(record) {
        // const url = 'http://192.168.92.3:5002' + record.path;
        const url = environment.imgUrl + record.path;

        window.open(url, '_blank');
    }

    onTableResize({ width }: NzResizeEvent, col: string): void {
        this.columnList.map(e => {
            if (e.name === col) {
                e.width = `${width}px`
            }
        })
    }
}
