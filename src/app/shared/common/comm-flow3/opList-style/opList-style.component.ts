import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, EventEmitter, Injectable, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UtilService } from '~/shared/services/util.service';
declare var $: any;
let keywordmodel: any = {};
let suntotal = 0;
let other: any = { bpi_key: '', psi_key: '' };
let ComparisonopL = new Array();
@Component({
    selector: 'opList-style',
    templateUrl: './opList-style.component.html',
    styleUrls: ['./opList-style.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpListStyleComponent implements OnInit {
    constructor(private _service: UtilService, private nzMessage: NzMessageService) { }
    private destroy$ = new Subject();
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
    /**款式 */
    @Input() psi_key: string = '';
    @Input() set bpi_key(v: string) {
        if (v) {
            other.bpi_key = v;
            other.psi_key = this.psi_key;
            // if (Comparisonop && Comparisonop.length > 0)
            this.opData()
        }
    };
    /**对比工序 */
    @Input() set Comparisonop(v: []) {
        if (v && v.length > 0) {
            ComparisonopL = v;
            this.opData()
        }
    };
    /**拖拽返回 */
    @Output() onDrag = new EventEmitter();
    ngOnInit(): void {
        other.psi_key = this.psi_key
        // this.OperationList.fetchPage(1);
        this.opData();
    }
    /**工序获取 */
    opData(keywords?: string, succse?) {
        this.OperationList = new styleDataSource(this._service);
        this.OperationList.completed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((v) => {
                if (suntotal == this.OperationList.cachedData.length) {
                    // this.nzMessage.warning(this._appservice.translate('warning.loadedall'));
                }
            });
    }
    qy(d) {
        if (d == 1) {
            if ($(".infinite-container")[0])
                $(".infinite-container")[0].scrollTop = 0;
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
class styleDataSource extends DataSource<any> {
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
        if (other.psi_key && other.bpi_key) {
            const body = Object.assign({ page: page, pagesize: this.pageSize }, other, keywordmodel ? keywordmodel : {})
            this._service.getPage('admin/StyleOperationProcessDetail/Extend/StyleOperation/', body, (v) => {
                this.total = v.length;
                suntotal = v.length;
                this.cachedData = this.cachedData.concat(v);
                this.cachedData.forEach(c => c.hasselect = ComparisonopL.find(ci => c.key == ci.poi_key) ? true : false)
                this.dataStream.next(this.cachedData);
                // this.nzMessage.warning(this._appservice.translate('warning.loadedall'));
            })
        } else {
            this.dataStream.next(this.cachedData);
        }
    }
}
