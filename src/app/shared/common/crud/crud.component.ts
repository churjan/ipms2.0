import { Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { AuthService } from '~/shared/services/http/auth.service';
import { UtilService } from '~/shared/services/util.service';
// import * as moment from 'moment';/
import { ListTemplateComponent } from '../base/list-template.component';
import { ImpComponent } from '../imp/imp.component';

@Component({
    selector: 'crud2',
    templateUrl: './crud.component.html',
    styleUrls: ['./crud.component.less']
})
export class CrudComponent extends ListTemplateComponent {
    project = sessionStorage.project;
    @ViewChild('imp', { static: false }) _imp: ImpComponent;
    /**顶部 */
    @Input() top: ElementRef
    /**顶部右边按钮 */
    // @Input() topRightActionsTpl: ElementRef
    /**是否可见 */
    visible: boolean = false;
    /**服务 */
    // @Input() service: any;
    /*******************样式参数******************************** */
    /**最大宽度 */
    // @Input() maxwidth: 1000;
    /**布局样式 (默认Up-Down)
     *类型：Up-Down(上下结构)、side-top-left(左-上下结构)、side-top-right(上-左右结构)
    */
    @Input() showLayout = 'Up-Down';
    /**右侧宽度 */
    @Input() Rwidth = '0px';
    /**左侧宽度 */
    @Input() Lwidth = '0px';
    /**系统主题(跟随系统) */
    theme: string = localStorage.theme
    /*******************路由参数******************************** */
    /*路由地址 */
    @Input() router: any;
    /**模块名 */
    @Input() jsonname: any;
    /**显示字段信息 */
    @Input() AllColumns: any = {};
    /**参数key */
    // @Input() ParamKey: any;
    /**上传地址 */
    @Input() impurl: string = "impurl";
    /**模板下载地址 */
    @Input() xlsurl: string = 'xlsurl';
    /**导出地址 */
    @Input() expurl: string = 'expurl';
    /* ******************查询属性******************************** */
    /**顶部or关键字查询对象 */
    SearchModel: any = {};
    /**关键字提示 */
    @Input() keyword_placeholder = 'placard.codename';
    /**关键字是否查询 */
    @Input() isKeyword: boolean = true;
    /**重点查询 */
    @Input() isKeyQuery: boolean = false;
    /**是否重置 */
    @Input() isRefresh: boolean = true;
    /*显示高级搜索*/
    @Input() showAdvanced: boolean = true;
    //重点查询内容
    @Input() KeyQuery: ElementRef
    /**高级查询对象 */
    @Input() seniorModel: any = {};

    @Input() isAddExpParams: boolean = false;

    /* ******************数据源******************************** */
    /**列表数据 */
    @Input() list: Array<any>
    /**总数据 */
    node: any
    /**传参 */
    @Input() getBody: any = {}
    /**字段 */
    @Input() fields: any = {}
    /**参数 */
    @Input() modular: any = {}
    /**获取接口后缀 */
    @Input() asktype: string = '';
    /**是否缓存表头 */
    @Input() isCache: boolean = false
    /**是否加载 */
    loading: boolean = false
    /**是否数据初始化 */
    @Input() isDataOnInit: boolean = true;
    /**是否单页统计 */
    @Input() isSingStatis: boolean = false;
    /**汇总数据 */
    sumNode: any = {}
    /**汇总字段 */
    @Input() sumFile: Array<any>;
    /**列表数据设置辅助字段 */
    @Input() detail: string = 'data';
    /* ******************分页属性******************************** */
    /**分页 */
    @Input() options: any = {
        total: 1, //总条数
        pageList: [15, 30, 45, 50, 100, 200] //每页显示条数
    }
    /**查询参数 */
    queryParams: any = {
        pageSize: 15,
        page: 1
    }
    /* ******************侧边属性******************************** */
    /**显示查询 */
    @Input() showTableTop: boolean = true
    //树状侧栏
    @Input() sideColumnTpl: ElementRef
    //查询侧栏
    @Input() searchActionsBody: ElementRef
    /**选中参数 */
    setOfCheckedId = new Set<string>()
    /**样式显示 */
    @Input() advancedActive: boolean = false
    /**关键字默认文字 */
    @Input() keywordPlaceholder: string = null;
    /**关键字绑定字段 */
    @Input() keywordKey: string = 'keywords';
    /**列表url地址对应字段 */
    @Input() listFun: string = 'url'
    /**重置返回事件 */
    @Output() onReset = new EventEmitter();
    /**额外查询参数 */
    // @Input()
    // set extraQueryParams(value: object) {
    //     this.queryParams = Object.assign(this.queryParams, value)
    //     this.extraQueryParamsCopy = value
    // }
    /**额外查询参数复制 */
    // extraQueryParamsCopy: any = {}
    /**显示页面容器 */
    // @Input() showInPageContainer: boolean = true
    /**主内容 */
    @Input() contentTest: ElementRef
    /**导出设置显示 */
    impoutVisible: boolean = false;
    /**导入导出条件设置页 */
    @Input() impoutTest: ElementRef
    /* ******************表格属性******************************** */
    /**显示配置表格*/
    @Input() isTest: boolean = false;
    /**表格 */
    @Input() tableTest: ElementRef
    /**最后一列 */
    @Input() lastColumnTpl: ElementRef
    /**最后一列宽度 */
    @Input() lastColumnWidth: number = 32 * 3;
    /**最后一列标题 */
    @Input() lastColumnTitle: string = null
    /**列表表尾 */
    @Input() FooterTpl: ElementRef
    /**列表扩展 */
    @Input() ExtendColumnTpl: ElementRef
    /**列表表头 */
    @Input() columns: any[] = []
    /**动态列表头 */
    @Input() dynamicColumns: any[] = []
    /**显示所选内容 */
    @Input() showSelection: boolean = true
    /**显示索引 */
    @Input() showIndex: boolean = true;
    /**是否分页 */
    @Input() position: boolean = true;
    /**是否数据分页 */
    @Input() FrontPagination: boolean = false;
    /**x轴滚动 */
    @Input() xScroll: string = "600px";
    /**y轴滚动 */
    @Input() yScroll: string = null
    /**抽屉标题高度 */
    @Input() drawerTitleHeight: number = 48
    /**状态 */
    @Input() Status = 99;
    /**负状态 */
    @Input() NegStatus = -1;
    /**进度计算公式参数 */
    @Input() statusnode = { all: '', current: '' };
    /**选择 */
    @Input() checkbox: boolean = true;
    /**底部 */
    @Input() isStatistics: boolean = false;
    /**表头是否筛选 */
    @Input() isSetList: boolean = true;
    /**是否动态 */
    @Input() isdynamic = false;
    /**是否操作 */
    @Input() isAction: boolean = true;
    /**是否开启动态请求 */
    @Input() isReport: boolean = false;
    /**动态字段 */
    @Input() dynamicfield: string;
    /**动态字段排序 */
    @Input() dynamisort: number = 0;
    /**动态字段显示 */
    @Input() dynamishow: string;
    /**按钮权限 */
    @Input() btnGroup: any;
    /**删除指定key */
    @Input() delkey: string = 'key';
    // 修改后返回事件
    @Output() Page = new EventEmitter();
    // 点击返回事件
    @Output() turnclick = new EventEmitter();
    /**单行点击返回事件*/
    @Output() lineClick = new EventEmitter();
    // 按钮点击返回事件
    @Output() actionClick = new EventEmitter();
    // 导入返回事件
    @Output() impClick = new EventEmitter();
    /**数据转化返回事件 */
    @Output() transform = new EventEmitter();
    /**上传地址 */
    @Input() ActionUrl: string;
    /**上传补充参数 */
    @Input() impNode: any = {};
    @Input() set inputVal(val: any) {
        if (this.showLayout != 'Container')
            this.btnGroup = this.authService.getBtn(this.router, null, null, val)
    }
    get inputVal() {
        return this.btnGroup;
    }
    @Input() isColSetReload = false; // 列设置后是否重新请求接口
    constructor(private authService: AuthService) { super() }
    /**初始化 */
    ngOnInit(): void {
        if (!localStorage.AllColumns) localStorage.AllColumns = '{}';
        this.AllColumns = JSON.parse(localStorage.AllColumns)[this.jsonname];
        if (this.isCache == true && this.getBody && this.getBody.columns) {
            this._service.comList('SystemInfo', { key: this.getBody.columns }, 'getkanbansetting', false).then((r) => {
                if (r) { this.columns = JSON.parse(r.settingstr); }
            })
        }
        if (this.showLayout != 'Container')
            this.btnGroup = this.btnGroup ? this.btnGroup : this.authService.getBtn(this.router)
        this.otherUrl = this.modular.otherUrl;
        if (!this.keywordPlaceholder) {
            this.keywordPlaceholder = this.getTipsMsg("inputdata.input_xx2", this.getTipsMsg("placard.keyword"))
        }
        // this.AllColumns.forChild(ac => ac.check = this.columns.find(c => c.coums == ac.coums) ? true : false);
        this.AllColumns.forEach(ac => ac.widthnum = ac.widthnum ? ac.widthnum : parseInt(ac.width.replace('px')));
        this.fieldcode = this.jsonname;
        this.sumFile = this.modular.sumNode;
        setTimeout(() => {
            this.top = this.searchActionsBody
        }, 200)
        if (this.isDataOnInit == true)
            this.GetList();
    }
    /**数据获取 */
    GetList(other?): void {
        this.loading = true;
        const that = this;
        let Model = Object.assign({ url: this.modular[this.listFun] ? this.modular[this.listFun] : this.otherUrl[this.listFun], other: other, data: null })
        let _smodel: any = {};
        let SearchModel = Object.assign({}, this.SearchModel, this.seniorModel)
        for (let k in SearchModel) {
            if (UtilService.isNotEmpty(SearchModel[k])) { _smodel[k] = SearchModel[k]; }
            if (that.SearchModel[k] == 0) { _smodel[k] = this.SearchModel[k]; }
        }
        let body: any = Object.assign({}, this.pageMap, this.getBody, _smodel, Model.other)
        if (this.isdynamic == true) this.dynamicColumns = [...this.columns]
        if (this.asktype == 'getlist') { body = Object.assign({}, this.getBody, _smodel, Model.other); this.position = false; }
        if (this.isReport == true) {
            Model.url = Model.url + '?PageSize=' + this.pageMap.pagesize + '&page=' + this.pageMap.page;
            body = Object.assign({}, { Order_Column: '', titles: [], order_type: true }, body);
            this.columns.forEach(v => {
                if (v.disabled != true) {
                    body.titles.push(v.coums);
                }
            })
            this._service.comPost(Model.url, body, this.asktype).then((result) => {
                this.node = result
                if (this.asktype != 'getlist') {
                    if (this.isStatistics != true && this.isdynamic != true) {
                        if (this.FooterTpl)
                            that.list = result.data[this.detail];
                        else
                            that.list = (result instanceof Array) == true ? result : result.data;
                    } else {
                        that.list = result.data[this.detail];
                        if (this.isStatistics == true) {
                            this.sumFile.forEach(s => {
                                // if (this.isSingStatis == true) {
                                //     if (s.b == true) {

                                //      } else {
                                //         this.sumNode[s.f] = s.c == 'total' ? result.total : result.data[s.c]
                                //     }
                                // } else {
                                this.sumNode[s.f] = s.c == 'total' ? result.total : result.data[s.c]
                                // }
                            })
                        }
                    }
                    that.options.total = result.total ? result.total : 1;
                } else that.list = result;
                if (this.isdynamic == true) {
                    // that.list = result[this.detail];
                    let _columns = new Array();
                    if (this.dynamishow == 'decompose') {
                        for (let c in result.data[this.dynamicfield]) {
                            _columns.push({ coums: c, name: result.data[this.dynamicfield][c], width: "100px" })
                        }
                    } else {
                        result.data[this.dynamicfield].forEach((c, i) => {
                            _columns.push({ coums: c[this.dynamishow], width: "100px", type: 'number' })
                        })
                    }
                    this.dynamicColumns.splice(this.dynamisort, 0, ..._columns)
                }
                if (Model.data) {
                    Model.data.forEach(cc => {
                        let _m = result.data.find(kk => kk.key == cc.key);
                        if (_m) { _m.checked = cc.checked; }
                    });
                }
                if (this.transform) {
                    this.transform.emit(result.data);
                }
            }, (err) => { this.list = []; });
        } else {
            this._service.getPage(Model.url, body, (result) => {
                this.node = result
                if (this.asktype != 'getlist') {
                    if (this.isStatistics != true && this.isdynamic != true) {
                        if (this.FooterTpl)
                            this.list = result.data && result.data[this.detail] ? result.data[this.detail] : ((result instanceof Array) == true ? result : result.data);
                        else
                            this.list = (result instanceof Array) == true ? result : result.data;
                    } else {
                        this.list = result.data[this.detail];
                        if (this.isStatistics == true) {
                            this.sumFile.forEach(s => {
                                this.sumNode[s.f] = result.data[s.c]
                            })
                        }
                    }
                    if (this.FrontPagination == false)
                        this.options.total = result.total ? result.total : 1;
                } else that.list = result;
                if (this.isdynamic == true) {
                    // that.list = result[this.detail];
                    let _columns = new Array();
                    result.data[this.dynamicfield].forEach((c, i) => {
                        _columns.push({ coums: c[this.dynamishow], width: "100px", type: 'number' })
                    })
                    this.dynamicColumns.splice(this.dynamisort, 0, ..._columns)
                }
                if (Model.data) {
                    Model.data.forEach(cc => {
                        let _m = result.data.find(kk => kk.key == cc.key);
                        if (_m) { _m.checked = cc.checked; }
                    });
                }
                if (this.transform) {
                    this.transform.emit(result.data);
                }
            }, (err) => { that.list = []; }, this.asktype);
        }
    }
    //删除
    delete(record?) {
        let data = [];
        let url = this.modular[this.listFun] ? this.modular[this.listFun] : this.otherUrl[this.listFun];
        if (!record) {
            this.setOfCheckedId.forEach((sc) => {
                if (!sc['key']) {
                    data.push({ key: sc[this.delkey] })
                } else {
                    data.push(sc)
                }
            })
            // data = [...this.setOfCheckedId]
            if (data.length <= 0) {
                this.message.warning(this._appService.translate("checkdata.check_leastoneledata"))
                return false
            }
        } else {
            if (record[this.delkey])
                data = [{ key: record[this.delkey] }]
            else
                data = [record];
        }
        this._modalService.confirm({
            nzTitle: this._appService.translate("confirm.confirm_del"),
            nzMaskClosable: true,
            nzOnOk: () => {
                this._service.deleteModel(url, data, (data) => {
                    this.message.success(this.getTipsMsg('sucess.s_delete'))
                    this.GetList();
                    if (this.turnclick) this.turnclick.emit()
                    if (this.lineClick) this.lineClick.emit()
                }, (msg) => { })
            }
        })
    }
    reloadData(bool) {
        //不重置搜索条件，只重置页码
        if (bool) { this.queryParams = Object.assign(this.queryParams, { page: 1 }) }
        this.GetList()
    }
    Importreturn(event) {
        if (this.impClick) { this.impClick.emit(event) }
        else this.reloadData(true)
    }
    // Search(ev?) {
    //     if (this.FrontPagination == true) {

    //     } else {
    //         super.Search(ev)
    //     }
    // }
    Reset(isRefresh = true) {
        super.Reset(isRefresh, this.FrontPagination);
        if (this.onReset)
            this.onReset.emit();
    }
    Localreset(isRefresh = true) {
        // this.pageMap.page = 1;
        // this.options.total = 0;
        this.seniorModel = {};
        if (isRefresh == true) { this.Search(null, null, this.FrontPagination); }
    }
    /**列表表头设置 */
    setColumns(item) {
        if (item.widthnum < item.minwidth) {
            this.message.warning(this.getTipsMsg(this.jsonname + '.' + item.coums) + this.getTipsMsg('placard.minw') + item.minwidth)
            item.widthnum = item.minwidth;
        }
        this.AllColumns.forEach(c => c.width = (c.minwidth > c.widthnum ? c.minwidth : c.widthnum) + 'px')
        let AllColumns = Object.assign({})
        AllColumns[this.jsonname] = this.AllColumns;
        localStorage.setItem("AllColumns", JSON.stringify(Object.assign({}, JSON.parse(localStorage.AllColumns), AllColumns)))
        // localStorage.AllColumns = JSON.stringify(Object.assign({}, JSON.parse(localStorage.AllColumns), AllColumns))
        this.columns = this.AllColumns.filter(ac => ac.check == true);
        let setNode: any = {}
        setNode[this.fieldcode] = this.columns;
        localStorage.setItem("setColumns2", JSON.stringify(setNode))
        // sessionStorage.setColumns = JSON.stringify(setNode);
        if (this.isCache == true) {
            this._service.saveModel('SystemInfo/savekanbansetting', 'post', { key: this.getBody.columns, SettingStr: JSON.stringify(this.columns) })
        }
        // if (UtilService.isNotEmpty(this.SearchModel) && JSON.stringify(this.SearchModel)!='{}')

        if(this.isColSetReload){
            this.Search()
        }
    }
    keywordSearch() { }
    /**单列点击 */
    onclick(ev) { this.turnclick.emit(ev) }
    /**行点击 */
    onlineClick(ev) {
        if (this.lineClick) this.lineClick.emit(ev)
    }
    timestamp: any = 0;
    active: string = '';
    onAction(ev) {
        if (this.timestamp > 0) {
            let newtime = new Date().getTime();
            if (newtime - this.timestamp <= 1500) { /**this.timestamp = new Date().getTime(); */return }
        }
        this.timestamp = new Date().getTime();
        if (ev.action.toLowerCase() == "del") { this.delete(ev.node) }
        else if (ev.action.toLowerCase() == 'imp') {
            if (this.impoutTest) {
                this.impoutVisible = true;
                this.active = ev.action;
            } else
                this.clang(ev.action)
            // this._imp.open({ title: 'import', node: this.impNode })
        }
        else if (ev.action.toLowerCase() == 'exp') {
            if (this.impoutTest) {
                this.impoutVisible = true;
                this.active = ev.action;
            } else {
                this.clang(ev.action)
            }
        }
        else if (!ev.node && this.setOfCheckedId) {
            ev.node = [...this.setOfCheckedId]
            this.actionClick.emit(ev)
        }
        else this.actionClick.emit(ev)
    }
    clang(active, ev?) {
        this.impoutVisible = false;
        if (!active) active = this.active;
        if (ev) this.SearchModel.Language = ev;
        if (active.toLowerCase() == 'exp') {
            let _SearchModel = Object.assign({}, this.SearchModel, this.seniorModel);
            if (this.isReport == true) {
                // Model.url = Model.url + '?PageSize=' + this.pageMap.pagesize + '&page=' + this.pageMap.page;
                _SearchModel = Object.assign({}, { Order_Column: '', titles: [], order_type: true }, _SearchModel);
                this.columns.forEach(v => {
                    // if (v.disabled != true) {
                    _SearchModel.titles.push(v.coums);
                    // }
                })
            }
            if (this.modular.Explist) {
                let start = '';
                let end = '';
                for (let l of this.modular.Explist) {
                    if (UtilService.isEmpty(_SearchModel[l]) == true) {
                        this.message.warning(this.getTipsMsg('checkdata.check_xx', this.getTipsMsg(this.jsonname + '.' + l)));
                        return
                    }
                    const isExist = this.modular.fields.find((coums) => coums.code == l && coums.type == 'time');
                    if (isExist && isExist.code.search("start") >= 0) { start = _SearchModel[l] }
                    if (isExist && isExist.code.search("end") >= 0) { end = _SearchModel[l] }
                    if (start != '' && end != '') {
                        if (UtilService.TimeComparison(start, end) == false) {
                            this.message.warning(this.getTipsMsg('warning.stargreatertend'));
                            return;
                        }
                        if (UtilService.getMonths(new Date(start), new Date(end)) > 3) {
                            this.message.warning(this.getTipsMsg('warning.overone3month'));
                            return;
                        }
                        // if (UtilService.DateMinus(start, end) > 31) {
                        //     this.message.warning(this.getTipsMsg('warning.overone1month'));
                        //     return;
                        // }
                    }


                }
            }

            if (this.isAddExpParams) {
                _SearchModel = { ..._SearchModel, ...this.getBody };
            }

            this.Exp(_SearchModel, false, this.expurl);
        }
        if (active.toLowerCase() == 'imp') {
            if (ev) this.impNode = { key: ev }
            this._imp.open({ title: 'import', node: this.impNode })
        }
    }
    /**上传状态更改 */
    handleChange(info: NzUploadChangeParam): void {
        if (info.file.status !== 'uploading') { }
        if (info.file.status === 'done') {
            this.message.success('sucess.s_upload');
        } else if (info.file.status === 'error') {
            this.message.error('fail.f_uploader');
        }
    }
}
