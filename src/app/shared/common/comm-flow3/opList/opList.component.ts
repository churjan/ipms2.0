import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UtilService } from '~/shared/services/util.service';
import { AppService } from '~/shared/services/app.service';
declare var $: any;
let keywordmodel: any = {};
let suntotal = 0;
@Component({
    selector: 'opList',
    templateUrl: './opList.component.html',
    styleUrls: ['./opList.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpListComponent implements OnInit {
    constructor(private _service: UtilService, private _appservice: AppService, private nzMessage: NzMessageService) { }
    private destroy$ = new Subject();
    /**系统主题(跟随系统) */
    theme: string = localStorage.theme
    /**工序列表 */
    OperationList;
    /**工序分页*/
    pageMap: any = { page: 1, pagesize: 20 };
    /**工序搜索 */
    selectedval: any = '';
    /**是否加载 */
    loadingMore = false;
    loading = true;
    doneto = 'doneList';
    /**拖拽返回 */
    @Output() onDrag = new EventEmitter();
    ngOnInit(): void {
        // this.OperationList.fetchPage(1);
        this.opData();
    }
    /**工序获取 */
    opData(keywords?: string, succse?) {
        this.OperationList = new MyDataSource(this._service);
        this.OperationList.completed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((v) => {
                // console.log(v)
                if (suntotal == this.OperationList.cachedData.length) {
                    this.nzMessage.warning(this._appservice.translate('warning.loadedall'));
                }
            });
    }
    qy(d) {
        if (d == 0) {
            $(".demo-infinite-container")[0].scrollTop = 1;
        } else {
            // this.OperationList.disconnect();
        }
    }
    /**搜索 */
    searchOp(event?: any) {
        const that = this;
        // if (!(event && event.keyCode !== 13)) {
        setTimeout(() => {
            keywordmodel = { keywords: this.selectedval }
            this.opData();
        }, 300)
        // }
    }
    add(item) {
        if (this.onDrag) this.onDrag.emit(item)
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
class MyDataSource extends DataSource<any> {
    private pageSize = 20;
    private total = 0;
    private cachedData: any[] = [];
    private fetchedPages = new Set<number>();
    private dataStream = new BehaviorSubject<any[]>(this.cachedData);
    private complete$ = new Subject<void>();
    private disconnect$ = new Subject<void>();

    constructor(private _service: UtilService) {
        super();
    }
    completed(): Observable<void> {
        return this.complete$.asObservable();
    }
    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        this.setup(collectionViewer);
        return this.dataStream;
    }

    disconnect(): void {
        this.disconnect$.next();
        this.disconnect$.complete();
    }

    private setup(collectionViewer: CollectionViewer): void {
        this.fetchPage(1);
        collectionViewer.viewChange.pipe(takeUntil(this.complete$), takeUntil(this.disconnect$)).subscribe(range => {
            if (this.cachedData.length >= this.total && this.total == suntotal) {
                this.complete$.next();
                this.complete$.complete();
            } else {
                const endPage = this.getPageForIndex(range.end);
                this.fetchPage(endPage + 1);
            }
        });
    }

    private getPageForIndex(index: number): number {
        return Math.floor(index / this.pageSize);
    }
    /**获取页面 */
    private fetchPage(page: number): void {
        if (this.fetchedPages.has(page)) {
            return;
        }
        this.fetchedPages.add(page);
        const body = Object.assign({ page: page, pagesize: this.pageSize }, keywordmodel ? keywordmodel : {})
        this._service.getPage('admin/Operationinfo/', body, (v) => {
            this.total = v.total;
            suntotal = v.total;
            this.cachedData = UtilService.uniq(this.cachedData.concat(v.data));
            // console.log(v.data)
            this.dataStream.next(this.cachedData);
            // this.nzMessage.warning(this._appservice.translate('warning.loadedall'));
        })
    }
}
