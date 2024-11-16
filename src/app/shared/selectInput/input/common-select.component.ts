import { Component, Output, OnInit, forwardRef, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UtilService } from '~/shared/services/util.service';
declare var $: any;
const C_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CommonSelectContent),
    multi: true
};
@Component({
    selector: 'ina-common-select',
    templateUrl: './common-select.component.html',
    providers: [C_SWITCH_CONTROL_VALUE_ACCESSOR],
    styleUrls: ['./common-select.component.scss']
})
/**公共下拉 */
export class CommonSelectContent implements ControlValueAccessor, OnInit, OnChanges {
    constructor(
        private service: UtilService,
        private message: NzMessageService
    ) { }
    /**查询值 */
    searchvalue: string = "";
    /**选择对象 */
    selectModel: any[] | any = {};
    /**初始化数据源*/
    @Input() optionList: any[] = [];
    /**初始值 */
    @Input() value: any[] | string;
    /**接口地址 */
    @Input() url: string;
    /**接口类型 */
    @Input() urltype: string;
    /**数据源类型 */
    @Input() Datatyle: string = 'Option';
    /**其他查询参数 */
    @Input() other: any;
    /**标题 */
    @Input() title: string;
    /**绑定字段 */
    @Input() DataFiled = 'key';
    /**绑定内容首显字段类型 */
    @Input() DataTxt = 'name';
    /**绑定内容次显字段类型 */
    @Input() secondary = 'code';
    /**是否登录 */
    @Input() islogin = true;
    /**状态标记*/
    loading = true;
    flag = false;
    /**完全加载 */
    Fullload = false;
    /**数据分页*/
    pageMap: any = { page: 1, pagesize: `20` };
    /**是否分页 */
    @Input() required = false;
    /**是否必选项 */
    @Input() ispaging = true;
    /**是否禁止 */
    @Input() isdisabled: boolean = false;
    /**是否查询 */
    @Input() isSeach = true;
    /**是否双值显 */
    @Input() isshow = true;
    /**是否多选*/
    @Input() multiple = false;
    /**是否联动*/
    @Input() linkage = false;
    /**是否停止获取*/
    @Input() isstop = false;
    /**联动数据*/
    @Input() set linkagedata(obj) {
        let Empty = true;
        for (let o in obj) {
            if (UtilService.isEmpty(obj[o]) == true) { obj[o] = ''; }
            if (UtilService.isNotEmpty(obj[o]) == true) { Empty = false; }
        }
        if (Empty == false) {
            this.other = this.other ? Object.assign(this.other, obj) : obj;
            // this.Search();
        }
    };
    /**是否可添加 */
    @Input() isAdd = false;
    /**
     * ComponentParam 模块选择
     * soncom 添加数据模块
     */
    @Input() AddConfiguration: any = {}
    /**选择后返回事件 */
    @Output() onSelect = new EventEmitter();
    /**双向绑定值改变 */
    writeValue(obj: any): void {
        if (UtilService.isNotEmpty(obj) == true || obj == 0) {
            this.value = obj;
            this.setValue();
        } else {
            if (this.isdisabled != true) {
                this.value = this.multiple == true ? [] : null;
            }
        }
    }
    /**改变*/
    ngOnChanges(changes: SimpleChanges) {
        if (changes.isdisabled && changes.isdisabled.previousValue) {
            this.isdisabled = changes.isdisabled.currentValue;
        }
        if (this.other && changes.linkagedata && changes.linkagedata.previousValue) {
            this.other = Object.assign({}, this.other, changes.linkagedata.currentValue);
            this.empty();
        }
        if (this.other && changes.other && changes.other.previousValue) {
            this.other = Object.assign({}, this.other, changes.other.currentValue);
            this.empty();
        }
        if (changes.optionList && changes.optionList.previousValue) {
            this.optionList = changes.optionList.currentValue;
        }
        if (changes.url && changes.url.previousValue) {
            this.url = changes.url.currentValue;
            this.empty();
        }
    }
    registerOnChange(fn: any) { this.onChangeCallback = fn; }

    registerOnTouched(fn: any) { this.onTouchedCallback = fn; }

    private onTouchedCallback = (v: any) => { }

    private onChangeCallback = (v: any) => { }
    /**初始化 */
    ngOnInit() {
        if (!this.optionList || this.optionList.length == 0)
            this.GetData();
        else {
            if (typeof this.optionList == 'string') {
                this.optionList = this.optionList ? JSON.parse(this.optionList) : []
            }
            this.setValue();
            this.loading = false;
            this.isstop = true
        }
    }
    GetData(Seach?) {
        if (UtilService.isNotEmpty(this.url)) {
            switch (this.urltype) {
                case 'enum':
                    this.isSeach = false;
                    this.service.enumList(this.url).then((result) => {
                        this.loading = false;
                        if (result) {
                            result.forEach(r => { r.leable = r[this.DataTxt]; });
                            this.optionList = result;
                        }
                    });
                    break;
                default:
                    let _body: Object = Object.assign({}, { keywords: this.searchvalue ? this.searchvalue : '' }, this.other);
                    if (this.ispaging == true) {
                        _body = Object.assign(_body, this.pageMap);
                    }
                    // if (this.Datatyle != "Option") {
                    //     _body = Object.assign({}, { keywords: this.searchvalue ? this.searchvalue : '' }, this.other);
                    // }
                    if (this.isstop == true) { this.loading = false; return; }
                    this.service.comList(this.url, _body, this.Datatyle, this.islogin).then((result) => {
                        if (result) {
                            let _data = new Array();
                            let _datda = result instanceof Array == true ? result : result.data;
                            _datda.forEach(r => {
                                r.leable = this.multiple == false && this.isshow == true && r[this.secondary] ?
                                    r[this.DataTxt] + '[' + r[this.secondary] + ']' : r[this.DataTxt];
                                if (r[this.DataTxt] && !r[this.secondary]) r.leable = r[this.DataTxt];
                                if (r[this.secondary] && !r[this.DataTxt]) r.leable = r[this.secondary];
                                if (this.DataTxt == this.secondary) { r.leable = r[this.DataTxt]; }
                                if (!this.optionList.find(dr => dr.key == r.key)) { _data.push(r); }
                            });
                            this.optionList = this.optionList.concat(_data);
                            this.optionList = UtilService.uniq(this.optionList);
                            if (_datda && this.optionList.length == result.total) { this.isstop = true; }
                            //内容获取后，隐藏加载提示
                            this.loading = false;
                            //修改
                            if (_body['keywords'] != this.searchvalue) {
                                this.GetData(Seach);
                                return;
                            }
                            //
                            if (!Seach) { this.setValue(); }
                        }
                    }).finally(() => { });
                    break;
            }
        } else { this.loading = false }
    }
    /**获取下一页 */
    loadMore() {
        if (this.Datatyle == "getlist") return;
        if (this.isstop == true) { return; }
        this.loading = true; this.pageMap.page++; this.GetData();
    }

    FillAvacancy(names?) {
        const that = this;
        if (this.isstop == true) { this.value = null; this.isstop = false; this.clickItem(); return; }
        if (this.DataFiled == 'code') { return; }
        if (this.url && this.url != '') {
            if (this.DataFiled == 'key') {
                this.service.getModel((this.islogin == true ? 'admin/' : '') + this.url + '/', names, (result) => {
                    this.isstop = true;
                    if (result) {
                        result[this.DataFiled] = typeof this.value == 'string' ? result[this.DataFiled].toString() : parseInt(result[this.DataFiled]);
                        result.leable = this.multiple == false && this.isshow == true && result[this.secondary] ?
                            result[this.DataTxt] + '[' + result[this.secondary] + ']' : result[this.DataTxt];
                        if (result[this.DataTxt] && !result[this.secondary]) result.leable = result[this.DataTxt];
                        if (result[this.secondary] && !result[this.DataTxt]) result.leable = result[this.secondary];
                        if (this.DataTxt == this.secondary) { result.leable = result[this.DataTxt]; }
                        that.optionList.push(...[result]);
                        that.setValue();
                    } else {
                        that.clickItem()
                    }
                    this.loading = false;
                })
            } else {
                let _m: any = {};
                _m[this.DataFiled] = names;
                _m = Object.assign(this.other ? this.other : {}, _m)
                this.service.comList(this.url, _m, this.Datatyle, this.islogin).then((result) => {
                    this.isstop = true;
                    let _datda = result instanceof Array == true ? result : result.data;
                    if (_datda) {
                        _datda.forEach(r => {
                            r.leable = this.multiple == false && this.isshow == true && r[this.secondary] ?
                                r[this.DataTxt] + '[' + r[this.secondary] + ']' : r[this.DataTxt];
                            if (r[this.DataTxt] && !r[this.secondary]) r.leable = r[this.DataTxt];
                            if (r[this.secondary] && !r[this.DataTxt]) r.leable = r[this.secondary];
                            if (this.DataTxt == this.secondary) { r.leable = r[this.DataTxt]; }
                        });
                        that.optionList.push(..._datda);
                        that.setValue();
                    } else {
                        that.clickItem()
                    }
                    this.loading = false;
                }, (err) => { that.clickItem() });
            }
        }
    }
    /**查询 */
    Search(ev?) {
        if (UtilService.isNotEmpty(this.url)) {
            this.searchvalue = ev;
            if (this.loading == true) return;
            this.loading = true;
            this.pageMap.page = 1;
            this.optionList = [];
            this.isstop = false;
            this.GetData(true);
        }
    }
    /**重置 */
    empty() {
        this.pageMap.page = 1;
        this.value = this.multiple == true ? [] : '';
        this.searchvalue = '';
        this.selectModel = null;
        this.isstop = false;
        this.optionList = [];
        this.GetData();
    }
    /**设置选中的值*/
    private setValue(obj?) {
        const that = this;
        let _value: any = this.value;
        if (!this.optionList || this.optionList.length == 0) { return; }
        if (this.urltype == 'enum') { _value = typeof this.value == 'string' ? parseInt(this.value) : this.value }
        let _node = that.optionList.find(x => x[this.DataFiled] == _value);
        if (this.multiple == true) {
            if (!_node) _node = [];
            if (typeof _value == 'object') {
                _value.forEach(_v => {
                    _node = that.optionList.filter(x => x[this.DataFiled] == _v);
                    if (!_node && this.urltype != 'enum' && this.Datatyle != "getlist" && UtilService.isNotEmpty(_value)) {
                        this.FillAvacancy(_v);
                        return;
                    }
                })
            }
        }
        if (_node) { this.clickItem(_value); } else {
            if (this.selectModel || UtilService.isNotEmpty(_value)) {
                let _itself: Object = Object.assign({}, this.selectModel);
                _itself[this.DataFiled] = _value;
                if (UtilService.isNotEmpty(_value) && this.urltype != 'enum' && this.Datatyle != "getlist") {
                    that.FillAvacancy(_value)
                }
            } else { that.clickItem(); }
        }
    }
    /**输出选中值 */
    clickItem(v?) {
        let _val: any = this.multiple == true ? [] : '';
        // console.log(_val,v)
        if (typeof v == 'string' || typeof v == 'number') {
            _val = this.optionList.find(x => x[this.DataFiled] == v);
        } else if (v && typeof v == 'object') {
            v.forEach(r => {
                _val.push(this.optionList.find(x => x[this.DataFiled] == r));
            })
        } else {
            v = '';
            _val = null;
        }
        this.onChangeCallback(v);
        this.onTouchedCallback(v);
        // console.log(_val)
        if (this.onSelect) { this.onSelect.emit(_val); }
    }
    /**添加 */
    // ComponentAddData(ev) {
    //     const that = this;
    //     if (ev) {
    //         if (this.AddConfiguration.ComponentParam) {
    //             this.AddConfiguration.hidden = true;
    //             let _component = this.AppComponentService.getsonComponent(this.AddConfiguration.soncom);
    //             this._pop.Open({
    //                 title: that.buttonList.add,
    //                 size: 'md',
    //                 zIndex: 100,
    //                 component: _component,
    //                 resolver: this.resolver,
    //                 parentInjector: that.AddConfiguration.ComponentParam.view,
    //                 Params: { Inputs: { model: null, ComponentParam: this.AddConfiguration.ComponentParam.view } },
    //                 back: function (result) {
    //                     that.AddConfiguration.hidden = false;
    //                     if (result === 1) {
    //                         that.pageMap.page = 1;
    //                         that.GetData();
    //                     }
    //                 }
    //             });
    //         }
    //     }
    // }
}