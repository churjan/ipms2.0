import { environment } from "@/environments/environment";
import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import axios from "axios";
import { NzMessageService } from "ng-zorro-antd/message";
import { fromEvent, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { I18nPipe } from "~/shared/pipes/i18n.pipe";
import { AppService } from "~/shared/services/app.service";
import { RetrievalService } from "../retrieval.service";

@Component({
    selector: 'retrieval-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.less'],
    providers: [I18nPipe]
})
export class RetrievalDetailsComponent implements AfterViewInit, OnDestroy {
    private subscription: Subscription;
    loading: boolean = false;
    @Input() cont: string = "";//关键字
    @Input() time: string = "";//日期
    @Input() type: number = null;//日志类型
    @Input() code: string = "";//线号
    @Input() StationCode: string = "";//站位号
    @Input() level: number = null;//等级
    @Input() page: number = 1;//当前页
    @Input() pageSize: number = 100;//当前每页数据数
    pageSizeSum: number = 100;//当前页面最多展示的条数
    previousPageSum: number = 100;//上一页的数据总条数
    // total:number = 0;//当前查询总条数
    listOfData = [];

    constructor(
        private retrievalService: RetrievalService,
        private i18n: I18nPipe,
        private message: NzMessageService,
        private el: ElementRef<HTMLElement>,
        private appService: AppService) { }

    ngOnInit(): void {
        this.loading = true;
        axios({
            url: environment.logUrl + "/api/admin/LogsTracking",
            method: 'get',
            headers: { 'token': sessionStorage.ticket },
            params: { Content: this.cont, Date: this.time, Type: this.type, LineCode: this.code, StationCode: this.StationCode, Level: this.level, Page: this.page, PageSize: this.pageSize }
        }).then((res) => {
            if (res.data.code == -99) {
                //token过期
                this.appService.clearAndLogout();
            }
            if (res.data.code == 0) {
                this.listOfData = res.data.data;
                this.previousPageSum = res.data.data.length;
                // this.total = res.data.total;
            } else if (res.data.code == 1) {
                this.message.error(res.data.message != null ? res.data.message : this.i18n.transform('warning.message1'));
            } else {
                this.message.error(this.i18n.transform('warning.message2'));
            }
            this.loading = false;
        }).catch((err) => {
            this.loading = false;
            // this.message.error("访问错误");
        }).finally(() => {
            this.loading = false;
        });
    }

    ngAfterViewInit() {
        const scrollContainer = this.el.nativeElement.querySelector(".ant-table-body") as HTMLElement; // 监听指定节点（元素）
        this.subscription = fromEvent(scrollContainer, 'scroll', { capture: true, passive: true })
            // scrollContainer为指定节点（元素），可以换成window
            // scroll监控滚动事件，resize为窗口大小改变，可换成需要的事件
            // passive:true //告诉浏览器不用调用preventDefault()，可以执行默认行为
            // capture:true,//事件捕获阶段，如果此元素的子元素被触发事件时，会先执行此事件
            .pipe(debounceTime(100)) // 设置时间间隔，优化性能
            .subscribe((event: Event) => this.onScroll(event.target as HTMLElement))
    }

    //滚动触发事件
    onScroll(target: HTMLElement) {
        //target.scrollHeight - target.clientHeight 为scrollTop滚动的最大值 也就是到底了
        if (target.scrollTop > (target.scrollHeight - target.clientHeight - 150) && this.previousPageSum == this.pageSize) {
            this.loading = true;
            this.page++;
            this.pageSizeSum = this.pageSizeSum + 100;
            axios({
                url: environment.logUrl + "/api/admin/LogsTracking",
                method: 'get',
                headers: { 'token': sessionStorage.ticket },
                params: { Content: this.cont, Date: this.time, Type: this.type, LineCode: this.code, StationCode: this.StationCode, Level: this.level, Page: this.page, PageSize: this.pageSize }
            }).then((res) => {
                if (res.data.code == -99) {
                    //token过期
                    this.appService.clearAndLogout();
                }
                if (res.data.code == 0 || res.data.code == 1) {
                    this.listOfData = [...this.listOfData, ...res.data.data];
                    this.previousPageSum = res.data.data.length;
                } else {
                    this.message.error(this.i18n.transform('warning.message2'));
                }
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
                this.message.error(this.i18n.transform('warning.message2'));
            }).finally(() => {
                this.loading = false;
            });
        }
    }

    ngOnDestroy() {
        // 销毁事件
        this.subscription?.unsubscribe();
    }
}