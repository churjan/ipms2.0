
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { AppService } from '~/shared/services/app.service';
import { AppConfig } from '~/shared/services/AppConfig.service';
import { AuthService } from '~/shared/services/http/auth.service';
declare var $: any;
/**列表显示 */
@Component({
    selector: 'ina-Report-show',
    templateUrl: './Report-show.component.html',
    styleUrls: ['./Report-show.component.less']
})
export class ReportShowComponent implements OnInit, OnChanges {
    constructor(private authService: AuthService, private el: ElementRef, private _appService: AppService) { }
    @ViewChild('fixedTable', { static: false }) _fixedTable: ElementRef;
    /**提示 */
    tipsMsg = AppConfig.tipsMsg;
    /**模块参数 */
    @Input() modular: any;
    /**模块名 */
    @Input() jsonname = "";
    /**路由地址 */
    @Input() router = "";
    /**数据源 */
    @Input() data: any;
    nodes: any = [];
    /**统计数据 */
    @Input() sumNode: any = {}
    /**字段信息 */
    @Input() fields: any = {};
    /**扩展关联字段 */
    @Input() Related = '';
    // @Input() nullbooln: boolean = true;
    /**表头名 */
    @Input() columnsfield: string = 'columns';
    /**表格尾部 */
    @Input() footer = false;
    /**表头列表 */
    @Input() columns: any;
    /**是否复制 */
    csscopy = false;
    /**扩展数据 */
    expanded: any;
    /**是否全选 */
    allChecked = false;
    /**选择框状态 */
    indeterminate = false;
    /**是否显示加载 */
    loading = true;
    /**状态 */
    @Input() Status = 99;
    /**负状态 */
    @Input() NegStatus = -1;
    /**是否统计 */
    @Input() isStatistics: boolean = false;
    /**是否排序*/
    @Input() isSort = false;
    /**是否操作 */
    @Input() isAction = true;
    /**是否展开 */
    @Input() expandable: boolean;
    /**是否选择 */
    @Input() checkbox = true;
    /**是否分页 */
    @Input() position: boolean;;
    /**分页 */
    @Input() pageMap: any = {
        page: 1,
        pagesize: 15
    }
    @Input() options: any = {
        total: 1, //总条数
        pageList: [15, 30, 45, 50, 100, 200] //每页显示条数
    }
    @Input() xScroll: string = "600px"
    /**行按钮 */
    @Input() btnGroup: any;
    /**最后一行 */
    @Input() lastColumnTpl: ElementRef
    /**列表表尾 */
    @Input() FooterTpl: ElementRef
    /**扩展 */
    @Input() ExtendColumnTpl: ElementRef
    // 选择后返回事件
    @Output() onSelect = new EventEmitter();
    // 点击返回事件
    @Output() onclick = new EventEmitter();
    //双击返回事件
    @Output() dblclick = new EventEmitter();
    // @Output() onPosition = new EventEmitter();
    // 链接打开
    @Output() onAopen = new EventEmitter();
    // 选择后返回事件
    @Output() onPage = new EventEmitter();
    /**顶级操作 */
    @Output() onAction = new EventEmitter();
    /**次级操作 */
    @Output() onDetailAction = new EventEmitter();
    /**排序 */
    @Output() onSort = new EventEmitter();
    /**单行点击返回事件*/
    @Output() lineClick = new EventEmitter();
    /**操作栏宽度 */
    btnGroupW = 50;
    ngOnInit() {
        this.btnChange();
        setTimeout(() => {
            // console.log(this.btnGroup)
            if (!this.btnGroup || this.btnGroup == []) this.btnChange();
        }, 300);
    }
    btnChange() {
        this.btnGroup = this.btnGroup ? this.btnGroup : this.authService.getBtn(this.router)
        let j = /^[\u4E00-\u9FFF]/;
        let N = this.getTipsMsg('btn.operation')
        this.btnGroupW = N.length * (j.test(N) ? 12 * 2 : 12);
        if (this.btnGroup.single) {
            let n = this.btnGroup.single.filter(c => !c.icon);
            if (!n) n = new Array();
            let _w = 0;
            _w = _w + (((this.lastColumnTpl ? this.btnGroup.single.length + 1 : this.btnGroup.single.length) * 2 - n.length) * 16);
            n.forEach((w, i) => {
                _w = _w + ((j.test(w.name) ? 12 * 2 : 12) * w.name.length);
                // this.btnGroupW = _w > this.btnGroupW ? _w : this.btnGroupW;
            });
            this.btnGroupW = _w > this.btnGroupW ? _w : this.btnGroupW;
        }
        if (this.btnGroup.extend && this.btnGroup.extend.length > 0) this.btnGroupW = this.btnGroupW + 28;
    }
    ngOnChanges(change) {
        this.searchData(true);
        this.btnChange();
    }
    print = (v) => { return v ? v.toLowerCase() : '' }
    /**更新数据 */
    searchData(reset: boolean = false): void {
        if (reset) {
            this.pageMap.pageIndex = 1;
        }
        this.checkAll(false);
        this.getTableScrollToTop();
        this.loading = false;
        this.nodes = this.data
    }
    /**全选 */
    checkAll(value: boolean): void {
        if (!this.nodes) this.nodes = [];
        this.nodes.forEach(_d => {
            if (!_d.disabled) {
                _d.checked = value;
            }
        });
        this.selectRow();
    }
    /**选择 */
    selectRow() {
        const validData = this.nodes.filter(value => !value.disabled);
        const allChecked = validData.length > 0 && validData.every(value => value.checked === true);
        const allUnChecked = validData.every(value => !value.checked);
        this.allChecked = allChecked;
        this.indeterminate = !allChecked && !allUnChecked;
        this.onSelect.emit(validData.filter(v => v.checked == true))
    }
    StandardLine(Standard) { }
    /**行点击选择 */
    select(item, i) {
        item.checked = !item.checked;
        this.selectRow();
        if (this.lineClick) this.lineClick.emit(item)
    }
    /**排序 */
    sort(sortname, sorttype): void {
        if (this.onSort) { this.onSort.emit({ orderfield: sortname, orderdirection: sorttype ? sorttype : '' }) }
    }
    /**更改页数 */
    PageSizeChange(ev): void {
        if (this.pageMap.page != 1) this.pageMap.page = 1;
        this.pageMap.pagesize = ev;
        if (this.pageMap.page == 1) this.PageIndexChange(1);
        this.loading = true;
    }
    /**更改当前页码 */
    PageIndexChange(ev) {
        this.pageMap.page = parseInt(ev) ? parseInt(ev) : 1;
        this.onPage.emit(this.pageMap);
        this.loading = true;
    }
    //查询或翻页后将表格滚动条回归到顶部
    getTableScrollToTop() {
        if (this._fixedTable)
            this._fixedTable['elementRef'].nativeElement.querySelector('.ant-table-body').scrollTop = 0;
    }

    /**文字提取 */
    getTipsMsg(condition, Dynamic?): string {
        return this._appService.translate(condition, Dynamic);
    }
    /**格式化 */
    delimiter(data, column) {
        let namecom = '';
        if (!column.delimiter) {
            column.field.forEach((f, i) => { namecom = i > 0 ? namecom + ',' + data[f] : (namecom + data[f]); });
            return data[column.field[0]] && data[column.field[1]] ? namecom : data[column.field[0]];
        } else {
            let _delimiter = column.delimiter.search('_')
            column.field.forEach((f, i) => {
                if (_delimiter > 0) {
                    namecom = namecom + (i > 0 ? column.delimiter.replace('_', data[f]) : data[f]);
                } else {
                    namecom = namecom + (i > 0 ? column.delimiter + data[f] : data[f]);
                }
            });
            return data[column.field[0]] && data[column.field[1]] ? namecom : data[column.field[0]];
        }
    }
    /**操作 */
    operation(ev, data, btnsmode) {
        if (this.onAction) { this.onAction.emit({ action: ev, node: data, sonbtn: btnsmode.sonbtn, title: btnsmode.name }) }
    }
    /**列表单字段操作 */
    open(ev, column, data) {
        if (column.open == true) {
            ev.stopPropagation();
            return this.onclick ? this.onclick.emit({ column: column, data: data }) : null
        }
    }
    /**宽度调整 */
    onResize({ width }: NzResizeEvent, col: string): void {
        let j = /^[\u4E00-\u9FFF]/;
        let N = this.getTipsMsg(this.jsonname + '.' + col)
        let _W = N.length * (j.test(N) ? 12 * 2 : 12);
        let sw = this.columns.reduce((a, b) => {
            let aw = typeof a == 'number' ? a : parseInt(a.width.split('px')[0]);
            let bw = parseInt(b.width.split('px')[0]);
            return aw + bw;
        }, 0)
        if (sw < $('.ant-table-header').width()) {
            let dvalue = 0;
            let currenti = 0;
            this.columns = this.columns.map((e, i) => {
                let ew = Math.ceil($('#' + e.coums).width());
                if (e.coums === col) {
                    dvalue = ew - Math.ceil(width);
                    currenti = i;
                    return { ...e, width: `${Math.ceil(width)}px` }
                } else if (i == currenti + 1) {
                    return { ...e, width: `${ew + (dvalue > 0 ? dvalue : 0)}px` }
                }
                return e.width ? e : { ...e, width: (ew + 'px') }
            });
        } else {
            this.columns = this.columns.map(e => (e.coums === col ? { ...e, width: `${(width < _W ? _W : width)}px` } : e));
        }
    }
}
