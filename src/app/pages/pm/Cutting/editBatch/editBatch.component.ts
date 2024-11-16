import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import * as moment from 'moment';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { UtilService } from '~/shared/services/util.service';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from "rxjs/operators";

@Component({
    selector: 'editBatch',
    templateUrl: './editBatch.component.html',
    styleUrls: ['./editBatch.component.less']
})
export class EditBatchComponent extends FormTemplateComponent {
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
        private el: ElementRef<HTMLElement>,
    ) { super() }
    private subscription: Subscription;
    @Output() editDone = new EventEmitter<boolean>()
    title: string
    width: string
    visible: boolean = false
    validateForm!: FormGroup
    submiting: boolean = false
    avatar: string
    /**列显示 */
    @Input() column: any[] = ["code", "mixcode", "psi_code", "pci_name", "psz_name"];
    nodes: any = [];
    /**是否停止获取*/
    @Input() isstop = false;
    /**数据分页*/
    pageMap: any = { page: 1, pagesize: 20 };
    /**当前页面最多展示的条数 */
    pageSizeSum: number = 20;
    /**上一页的数据总条数 */
    previousPageSum: number = 20;
    /**状态标记*/
    loading = true;
    /**作业单查询值 */
    searchvalue: string = "";
    /**初始化数据源*/
    @Input() optionList: any[] = [];
    /**列表查询值 */
    filsearchValue: any = {};
    /**筛选访问 */
    filvisible: any = {};
    /**其他查询参数 */
    @Input() other: any;
    /**筛选字段*/
    currentField: string
    /**选择对象 */
    selectModel: any[] | any = {};
    /**滚动高 */
    Scrolly: any = '0'
    /**预览开关 */
    previewVisible: boolean = false;
    /**预览数据 */
    previewList = new Array();
    ngOnInit(): void {
        this.validateForm = this.fb.group({
            station_code: [{ value: null, disabled: true }, [Validators.required]],
            pwb_code: [null, [Validators.required]],
            bpi_code: [null, [Validators.required]],
            sort: [null],
            enable: [null],
            key: [null]
        })
    }

    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        if (record.node && record.node.key) {
            this.key = record.node.key
            this._service.getModel(this.modular.url, this.key, (response: any) => {
                this.validateForm.patchValue(response)
                this.model = Object.assign({}, response)
            })
        } else {
            this.key = null;
            this.model = Object.assign({}, record.node)
            this.validateForm.patchValue(record.node)
        }
        this.GetData()
        this.visible = true
        setTimeout(() => {
            const scrollbody = document.getElementsByClassName("body beauty-scroll");
            this.Scrolly = scrollbody[0].clientHeight - 40 - 60
            const scrollContainer = this.el.nativeElement.querySelector(".ant-table-body") as HTMLElement; // 监听指定节点（元素）
            this.subscription = fromEvent(scrollContainer, 'scroll', { capture: true, passive: true })
                // scrollContainer为指定节点（元素），可以换成window
                // scroll监控滚动事件，resize为窗口大小改变，可换成需要的事件
                // passive:true //告诉浏览器不用调用preventDefault()，可以执行默认行为
                // capture:true,//事件捕获阶段，如果此元素的子元素被触发事件时，会先执行此事件
                .pipe(debounceTime(100)) // 设置时间间隔，优化性能
                .subscribe((event: Event) => this.onScroll(event.target as HTMLElement))

        }, 300);
    }
    //滚动触发事件
    onScroll(target: HTMLElement) {
        //target.scrollHeight - target.clientHeight 为scrollTop滚动的最大值 也就是到底了
        if ((target.scrollTop > (target.scrollHeight - target.clientHeight - 150)) && (this.previousPageSum == this.pageMap.pagesize)) {
            this.loading = true;
            this.pageMap.page++;
            this.pageSizeSum = this.pageSizeSum + 20;
            this.GetData()
            // axios({
            //     url: environment.logUrl + "/api/admin/LogsTracking",
            //     method: 'get',
            //     headers: { 'token': sessionStorage.ticket },
            //     params: { Content: this.cont, Date: this.time, Type: this.type, LineCode: this.code, StationCode: this.StationCode, Level: this.level, Page: this.page, PageSize: this.pageSize }
            // }).then((res) => {
            //     if (res.data.code == -99) {
            //         //token过期
            //         this.appService.clearAndLogout();
            //     }
            //     if (res.data.code == 0 || res.data.code == 1) {
            //         this.listOfData = [...this.listOfData, ...res.data.data];
            //         this.previousPageSum = res.data.data.length;
            //     } else {
            //         this.message.error(this.i18n.transform('warning.message2'));
            //     }
            //     this.loading = false;
            // }).catch((err) => {
            //     this.loading = false;
            //     this.message.error(this.i18n.transform('warning.message2'));
            // }).finally(() => {
            //     this.loading = false;
            // });
        }
    }
    GetData(Seach?) {
        let _body: Object = Object.assign({}, this.pageMap, { keywords: this.searchvalue ? this.searchvalue : '' }, this.filsearchValue, this.other, Seach);
        // if (this.isstop == true) { this.loading = false; return; }
        this.getPage(_body);
    }
    getPage(body) {
        this._service.getPage('admin/WorkBill/', body, (result) => {
            this.nodes = result.data
            let data = (result instanceof Array) == true ? result : result.data;
            this.optionList = [...this.optionList, ...data];
            this.previousPageSum = data.length;
            this.loading = false;
        }, (err) => { this.optionList = []; });
    }
    /**查询页打开 */
    filterFieldOpen(visible: boolean, field: string) {
        if (visible) {
            this.currentField = field
        } else {
            this.currentField = null
        }
    }
    /**查询 */
    Search(ev?) {
        if (!ev || ev.key == "Enter") {
            if (this.loading == true) return;
            this.loading = true;
            if (this.currentField) this.filvisible[this.currentField] = false
            this.pageMap.page = 1;
            this.optionList = [];
            this.isstop = false;
            this.GetData(true);
        }
    }
    /**全部重置 */
    allreset() {
        this.filsearchValue = {};
        this.empty();
    }
    /**重置 */
    empty() {
        this.pageMap.page = 1;
        this.searchvalue = '';
        this.filsearchValue[this.currentField] = null
        this.selectModel = null;
        this.isstop = false;
        this.optionList = [];
        this.GetData();
    }
    onSelect(event) {
        this.validateForm.addControl('bpi_code', new FormControl(null, Validators.required))
    }
    /**选中值 */
    clickItem(v?, ev?) {
        if (v) {
            this.previewList = this.previewList.filter(p => p.pwb_code != v.code);
            if (v.bpi_list.length > 0) {
                v.checked = true;
                let transfer = new Array();
                if (ev) { v.bpi_data = ev }
                v.bpi_list.forEach((vb, vbi) => {
                    transfer.push({
                        station_code: this.model.station_code,
                        pwb_code: v.code,
                        mixcode: v.mixcode,
                        psi_code: v.psi_code,
                        pci_name: v.pci_name,
                        psz_name: v.psz_name,
                        quantity: v.quantity,
                        bpi_code: vb,
                        bpi_name: v.bpi_data[vbi].name,
                        sort: v.sort
                    })
                })
                this.previewList = [...this.previewList, ...transfer];
                // this.previewList = [...this.previewList, ...[{
                //     station_code: this.model.station_code,
                //     pwb_code: v.code,
                //     "mixcode": v.mixcode,
                //     "psi_code": v.psi_code,
                //     "pci_name": v.pci_name,
                //     "psz_name": v.psz_name,
                //     "quantity": v.quantity,
                //     bpi_list: v.bpi_list,
                //     sort: v.sort
                // }]];
            } else {
                v.checked = false;
            }
        }
    }
    delselect(data) {
        this.previewList = this.previewList.filter(p => p.pwb_code != data.pwb_code || p.bpi_code != data.bpi_code);
        this.optionList.forEach(o => {
            if (o.code == data.pwb_code) {
                o.checked = false;
                o.bpi_list = o.bpi_list.filter(b => b != data.bpi_code);
            }
        })
    }
    submitForm(event?: KeyboardEvent) {
        if (this.submiting == true) return false
        if (!event || event.key == "Enter") {
            let model = new Array();
            // this.submit();
            // if (this.validateForm.status == 'VALID') {
            //     model = Object.assign({}, this.model, this.validateForm.value);
            // } else { this.submiting = false; return }
            // this.previewList.forEach(p => {
            // p.bpi_list.forEach(pb => {
            //     model.push({
            //         station_code: p.station_code,
            //         pwb_code: p.pwb_code,
            //         bpi_code: pb,
            //         sort: p.sort
            //     })
            // })
            // })
            this.submiting = true;
            this._service.saveModel(this.modular.otherUrl.batchsave, 'post', this.previewList, (result) => {
                this.message.success(this.getTipsMsg('sucess.s_save'));
                this.submiting = false;
                this.editDone.emit(true)
                this.close();
            }, (msg) => { this.submiting = false });
        }
    }

    close(): void {
        this.validateForm.reset()
        this.searchvalue = '';
        this.previewList = new Array();
        this.optionList = new Array();
        this.avatar = null
        this.visible = false
    }


}
