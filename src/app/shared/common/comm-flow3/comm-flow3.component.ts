import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, EventEmitter, Injectable, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from '../base/form-Template.component';
import { UtilService } from '~/shared/services/util.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { forkJoin } from 'rxjs';
import { WorkBalanceComponent } from './WorkBalance/WorkBalance.component';
import { ImpComponent } from '../imp/imp.component';
import { environment } from '@/environments/environment';
import { PriceComponent } from './Price/Price.component';
import { StationSetComponent } from './stationSet/stationSet.component';
import { SkuProcessService } from '~/pages/warehouse/wms/sku-process/sku-process.service';
import { WebsiteComponent } from './website/website.component';

declare var $: any;
/**权限 */
export class Power {
    /**工序流类型 */
    type?: string;
    /**工序流权限 */
    flowpower?: boolean = false;
    /**路线图权限 */
    mappower?: boolean = false;
    /**工价权限 */
    wages?: boolean = false;
    /**是否允许复制 */
    Iscopy?: boolean = true;
    /**是否允许修改 */
    IsUpdate?: boolean = true;
    /**工段权限 */
    issdiction?: boolean = false;
    /**共享 */
    ispublic?: boolean = false;
    /**版本权限 */
    sversion?: number
}
@Component({
    selector: 'flow3',
    templateUrl: './comm-flow3.component.html',
    styleUrls: ['./comm-flow3.component.less']
})
@Injectable({ providedIn: 'root' })
export class CommFlowthreeComponent extends FormTemplateComponent {
    constructor(private http: HttpClient, private _renderer: Renderer2,
        private breakpointObserver: BreakpointObserver, private sps: SkuProcessService) { super(); }
    /**系统主题(跟随系统) */
    theme: string = localStorage.theme
    /**平衡 */
    @ViewChild('Balance', { static: false }) _Balance: WorkBalanceComponent;
    /**站位规则设置 */
    @ViewChild('stationSet', { static: false }) _stationSet: StationSetComponent;
    /**工价 */
    @ViewChild('Price', { static: false }) _Price: PriceComponent;
    /**导入 */
    @ViewChild('imp', { static: false }) _imp: ImpComponent;
    @ViewChild('website', { static: false }) _website: WebsiteComponent
    @Output() editDone = new EventEmitter<boolean>();
    /**弹窗开启/关闭 */
    avatar: string;
    /**是否显示 */
    visible: boolean = false;
    /**窗体宽度 */
    width: string;
    /**窗体标签 */
    title: string;
    /**上级传入参数 */
    node: any = {};
    /**查询类型 */
    favoriteSeason: string = "setstation";
    /**默认数据 */
    default = { parts: [], worksections: [] }
    record: any = {};
    psi_key: string;
    /****************************款式工序流**********************************/
    // newmodel: any = {};
    /**路线图选择 */
    pormType: any = [];
    /**作业单关联列表 */
    dataSet = new Array();
    isVisible: boolean = false;
    /****************************部件**********************************/
    /**部件类型 */
    bpitype: any[] = [];
    /**部件列表 */
    bpiList: any[] = [];
    /**部件查询 */
    searchPart: any = {};
    /****************************工序**********************************/
    /**工序流总工序 */
    options: any[] = [];
    /**工序参数
     *@param optyle 工序类型
     *@param pageMap 工序分页
     *@param selectedval 工序搜索
     */
    opParameter: any = { optyle: [], pageMap: { page: 1, pagesize: 10 }, selectedval: '' }
    /**是否加载 */
    loadingMore = false;
    /**加载中 */
    loading = true;
    /**拖拽存放区 */
    doneto = 'doneList';
    /**待选列表选择 */
    listSelectedIndex = 0;
    /****************************站位**********************************/
    /**布局结构参数 */
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', child: 'sonlist', url: 'LayoutStructure/extend' };
    /**树状站位筛选条件 */
    stationRailtree = { maketree: true, moduletype: 101 };
    /**站位 */
    list_station: any[] = [];
    /**站位选择 */
    stationselect: string;
    /**树形参数 */
    mapOfExpandedData: { [key: string]: any[] } = {};
    /*****************************工序流复制 ****************************/
    /**同款作业单 */
    sameParaWork = new Array();
    /**复制参数 */
    copymodel: any = {};
    /***下拉显示 */
    popoverVisible: boolean = false;
    /**复制进度 */
    CopyProgress = false;
    /*****************************工序流********************************/
    /**工序流 */
    newFlow: any = {};
    /**工序流暂存数据*/
    newOP: any[] = [];
    /**标签页选择 */
    selectedIndex = 0;
    /**调整对象 */
    param: any = {};
    /**选中参数 */
    selectoeder: any = {};
    /**当前部件已设置工序对照组集合 */
    flowopall = new Array()
    /**锚点选择列表 */
    filteredOptions = new Array();
    /**设置站位合集 */
    StationAggregation: any[] = [];
    /**选中锚点 */
    inputValue?: string;
    /****************************权限**********************************/
    /**路线图计算方式  */
    routecalculation = "1";
    /**工段操作权限 */
    bwi_list = new Array();
    /**权限集合 */
    power: Power = new Power();
    /**版本权限 */
    versionPower: any = 1;
    /**是否开启备用站*/
    isoverload = false;
    /**是否显示配比*/
    routertype: string = '1';
    /**是否显示分流*/
    diversionscheme = false;
    /**是否显示帮工*/
    operationhelper = false;
    /**特殊权限 */
    btnstationset: any = {};
    /**特殊按钮 */
    btnGroup: any
    /**已使用站位 */
    usedstation = new Array();
    /**是否上裁进入 */
    @Input() isCutIn: boolean = false;
    /**修改记录 */
    ishistory: boolean = false;
    /**是否重置工序流 */
    isRefreshFlow: boolean = true;
    /****************************工段**********************************/
    /**预览工段 */
    divider = new Array();
    /**工段*/
    section: any[] = [];
    /**选中工段 */
    nzSelected: string = '';
    /****************************返回数据**********************************/
    setvisible: any[] = [];
    /**导入返回 */
    @Output() onImp = new EventEmitter();
    /**复制返回 */
    @Output() onCopy = new EventEmitter();
    /**保存返回 */
    @Output() onSave = new EventEmitter();
    /**关闭返回 */
    @Output() onClose = new EventEmitter();
    /**回退返回 */
    @Output() onReturn = new EventEmitter();
    /**工序规则待选组 */
    OPSList = new Array();
    /**工序规则 */
    OperationRule = new Array();
    /**初始化 */
    ngOnInit(): void {
        this.otherUrl = this.modular.otherUrl;
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) { this.width = '800px' } else { this.width = '100%' }
        })
        this._service.getModel('SystemInfo/getoperationprocessconfig', '', (r) => {
            this.diversionscheme = r.diversionscheme;
            this.operationhelper = r.operationhelper;
            this.isoverload = r.schemeoverload;
            this.routertype = r.distributionmode;
            this.routecalculation = r.routecalculation;
            if (r.styleprocessversion) this.versionPower = r.styleprocessversion;
            this.btnstationset = r.UseDiversionScheme && r.UseDiversionScheme == 'true' ? true : false;
            this.default.parts = r.default_parts ? r.default_parts : []
            this.default.worksections = r.default_worksections ? r.default_worksections : []
        }, (err) => {
            this.isoverload = false;
        })
        this.GetParameters();
        if (localStorage.getItem("stationCache")) {
            let stationCache = JSON.parse(localStorage.getItem("stationCache"));
            this.stationselect = stationCache.key;
            this.getstation('', stationCache)
        }
    }
    /**打开弹窗 */
    async open(record: any) {
        if (record) {
            this.title = this._appService.translate("placard." + record.title);
            this.record = record;
            this.otherUrl = this.modular.otherUrl;
            this.newOP = new Array();
            if (record.isreturn == true) record.isreturn = false;
            if (record.node && record.node.isreturn == true) record.node.isreturn = false;
            if (record.UseDiversionScheme) {
                this.btnstationset = record.UseDiversionScheme == 'true' ? true : false;
            } else this.btnstationset = false
            if (record.btnGroup) { this.btnGroup = record.btnGroup }
            if (sessionStorage.bwi_list) {
                let _bwi_list = JSON.parse(sessionStorage.bwi_list);
                if (!this.bwi_list) { this.bwi_list = []; }
                if (_bwi_list) { _bwi_list.forEach(_b => { if (_b && _b != null && _b != undefined) { this.bwi_list.push(_b); } }) }
            }
            this.node = record.node;
            this.key = record.node.key;
            this.psi_key = record.type == 'W' ? record.other_node?.psi_key : record.other_node?.key;
            this.copymodel.psi_key = this.psi_key ? this.psi_key : '';
            this.section = record.worksectionlist;
            this.power = Object.assign(this.power, record.power, { type: record.type })
            if (this.power.sversion) this.versionPower = this.power.sversion;
            this.power.type = record.type;
            //opp_type工序流模式
            this.node.opp_type = this.node.opp_type ? this.node.opp_type : parseInt(sessionStorage.opp_type);
            this._service.comList('OperationProcessMaster/Extend/UsingWorkbill', { key: this.key }).then(v => {
                this.dataSet = v;
            })
            this.power.IsUpdate = true;
            if (record.action == "preview" || record.action == 'copypreview') {
                this.power.IsUpdate = false; this.preview()
            } else {
                this.power.IsUpdate = true;
                this.getList(this.otherUrl?.getFlow, { popm_key: this.node.key, bwi_key: this.node.bwi_key });
            }
        } else {
            this.key = null
        }
        this.visible = true
    }
    /**数据获取 */
    getList(url, body) {
        this._service.getPage('admin/OperationProcessMaster/Extend/GetSectionDetail/', body, (result) => {
            if (result) {
                let _node: any = result;
                if (this.CopyProgress == false)
                    this.newFlow = Object.assign({}, result);
                else if (this.CopyProgress == true) {
                    _node = Object.assign({}, this.newFlow, { partlist: result.partlist, worksectionlist: result.worksectionlist })
                    this.CopyProgress = false;
                }
                this.HandleData(_node);
            }
        }, (err) => {
            // this.message.error(err)
        });
    }
    sectionSwitch(sec) {
        this.nzSelected = sec ? sec.bwi_code : '';
        this.node.bwi_key = sec.bwi_key;
        this.getList('', { popm_key: this.node.key, bwi_key: sec.bwi_key })
    }
    setIsbackflow() {
        this._service.saveModel('admin/OperationProcessMaster/Extend/SaveBackFlow', 'post', this.node, (sucess) => {
            this.message.success(this.getTipsMsg('sucess.s_set'))
        })
    }
    /**站位待选分级 */
    collapse(array: any[], data: any, $event: boolean): void {
        if ($event === false) {
            if (data.children) {
                data.children.forEach(d => {
                    const target = array.find(a => a.key === d.key)!;
                    target.expand = false;
                    this.collapse(array, target, false);
                });
            } else {
                return;
            }
        }
    }
    /**工价推送 */
    push(ev) {
        if (UtilService.isEmpty(this.newFlow.psopm_customcode) == true) {
            this.message.error(this.getTipsMsg('inputdata.input_customcode'))
            return
        }

        this._Price.open({ title: this.getTipsMsg('placard.PricePush'), node: this.newFlow.psopm_customcode })
    }
    /**锚点数据获取 */
    onInput(e?: Event): void {
        let _favorite = this.favoriteSeason ? this.favoriteSeason : 'title';
        const value = e ? (e.target as HTMLInputElement).value : this.inputValue;
        let fList = this.favoriteSeason == 'setstation' ? this.StationAggregation : this.options;
        let oplist = fList.filter(option => option[_favorite].toLowerCase().indexOf(value) >= 0);
        if (!value) {
            this.Anchorname = null;
            this.filteredOptions = [];
        } else {
            this.filteredOptions = oplist;
        }
    }
    enter(ev) {
        if (!(ev && ev.keyCode !== 13)) {
            let nodeindex = this.filteredOptions.findIndex(f => f.code == this.inputValue);
            if (nodeindex >= 0)
                this.location(this.filteredOptions[nodeindex], nodeindex)
        }
    }
    pointSelect(ev) { this.onInput(); }
    /**删除路线图 */
    delmap(key) {
        const that = this;
        if (key) {
            const smap = this.pormType.find(k => k.key == key);
            this.Confirm('confirm.confirm_deln', smap.name, (result) => {
                if (result == 'pass') {
                    that._service.deleteModel(that.otherUrl.flow.map, [smap], (result) => {
                        this.message.success(this.getTipsMsg('sucess.s_delete'));
                        // that.newmodel.psorm_key = '';
                        // that.newmodel.psorm_name = '';
                        // that.getList();
                    }, function (err) {
                        that.message.error(this.getTipsMsg('fail.f_delete') + err);
                    });
                }
            })
        }
    }
    /**参数获取 */
    async GetParameters() {
        if (!this.default.worksections || this.default.worksections.length == 0)
            this._service.comList('WorkSectionInfo/Extend', {}, 'GetMyWorkSectionInfo/').then(v => { this.bwi_list = this.bwi_list.concat(v); })
        else
            this.bwi_list = this.default.worksections;
        var source = forkJoin(
            this._service.enumList('operationenum'),
            this._service.enumList('partclass'),
        ).toPromise<[any, any]>().then((data) => {
            data.map((v, i) => {
                switch (i) {
                    case 0:
                        if (!v) { v = []; }
                        this.opParameter.optyle = v.filter(ty => ty.value != 1000);
                        break;
                    case 1: this.bpitype = v; break;
                }
            });
        }, (error) => { });
        this.getOPS()
    }
    /**数据重组 */
    HandleData(data, is?) {
        this.newFlow = Object.assign(this.newFlow, data);
        if (this.newFlow.partlist && this.newFlow.partlist.length > 0) {
            this.newFlow.partlist.forEach((x, fpnum) => {
                if (this.node.isdefault == true && this.node.psorm_key) { x.isfold = false; } else {
                    if (is && (!x.isfold || x.isfold == null)) { x.isfold = false; } else if (!x.isfold || x.isfold == null) {
                        if (this.power.type == 'W') { x.isfold = false; } else { x.isfold = true; }
                    }
                }
                x.bpi_sort = x.bpi_sort ? x.bpi_sort : fpnum;
                if (this.section && this.section.length > 0) {
                    if (this.nzSelected == '') this.nzSelected = this.section[0].bwi_code
                    let _check = this.section.find(s => s.bwi_code == this.nzSelected);
                    this.sectionCheck(_check ? _check : this.section[0], 0);
                } else { this.preview(); }
            });
            this.flowopall.push(... this.newFlow.partlist[this.selectedIndex].detaillist)
            this.flowopall = UtilService.uniq(this.flowopall)
        }
    }
    /**站位获取 */
    getstation(blst_key, ev?, pkey: string = '') {
        const that = this;
        if (ev) { pkey = ev.key; }
        if (!ev || !ev.key) {
            that.list_station = new Array();
            return
        }
        that.list_station = ev.sonlist;
        if (that.list_station && that.list_station.length > 0) {
            if ((that.list_station.length >= 2 && that.list_station[0].group == "In") || that.list_station[0].group != "In") {
                that.list_station.forEach(e => { if (!e.mixtureratio) { e.mixtureratio = 1; } });
            } else {
                that.list_station = new Array();
                that.list_station.push(Object.assign({ mixtureratio: 1 }, ev));
            }
            localStorage.setItem("stationCache", JSON.stringify(ev))
        } else {
            that.list_station = new Array();
            that.list_station.push(Object.assign({ mixtureratio: 1 }, ev));
        }
        this.list_station.forEach(item => {
            if (this.usedstation.find(s => s.key == item.key || s.code == item.code)) { item.used = true; } else { item.used = false; }
            this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        });
    }
    convertTreeToList(root: object): any[] {
        const stack: any[] = [];
        const array: any[] = [];
        const hashMap = {};
        stack.push({ ...root, level: 0, expand: false });

        while (stack.length !== 0) {
            const node = stack.pop();
            this.visitNode(node, hashMap, array);
            if (node.children) {
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node, mixtureratio: 1 });
                }
            }
        }

        return array;
    }
    /**已使用站位统计 */
    isused() {
        this.usedstation = UtilService.uniq(this.usedstation)
        this.list_station.forEach(item => {
            if (this.usedstation.find(s => s.code == item.code)) { item.used = true; } else { item.used = false; }
        })
    }
    visitNode(node: any, hashMap: { [key: string]: any }, array: any[]): void {
        if (!hashMap[node.key]) {
            hashMap[node.key] = true;
            array.push(node);
        }
    }
    Anchornum = 0;
    Anchorname = '';
    ctrlup = false;
    ctrldown = false;
    /**定位移动 */
    move(n) {
        if (this.ctrlup == false && this.ctrldown == false) { return }
        let fList = this.favoriteSeason == 'setstation' ? this.StationAggregation : this.options;
        this.Anchornum = this.Anchornum + n;
        if (this.inputValue == '') {
            this.location(fList[this.Anchornum]);
        } else {
            let _favorite = this.favoriteSeason ? this.favoriteSeason : 'title';
            if (!fList.find(option => option[_favorite] == this.inputValue)) {
                let oplist = fList.filter(option => option[_favorite].indexOf(this.inputValue) >= 0);
                this.Anchornum = this.Anchornum > oplist.length - 1 ? (this.Anchornum - n) : this.Anchornum;
                this.location(oplist[this.Anchornum]);
            } else { this.location(this.inputValue); }
        }
    }
    /**定位 */
    location(value, i?) {
        let _favorite = this.favoriteSeason ? this.favoriteSeason : 'title';
        let AnchorList = new Array();
        let hash: any;
        let fList = this.favoriteSeason == 'setstation' ? this.StationAggregation : this.options;
        let sli = fList.filter(option => option[_favorite].indexOf(this.inputValue) >= 0);
        if (this.favoriteSeason == 'setstation') {
            let t = typeof value == 'string' ? value : value.code;
            sli.forEach(s => { AnchorList.push(...s.poi_list); })
            this.Anchornum = i ? 0 : this.Anchornum;
            this.Anchorname = t;
            let sash = $("p[id='" + t + "']");
            let span = $("span[id='" + t + "']");
            let nlength = sash.length + span.length;
            this.ctrlup = nlength > 1 && this.Anchornum > 0 ? true : false;
            this.ctrldown = nlength > 1 && this.Anchornum != nlength - 1 ? true : false;
            if (this.Anchornum < AnchorList.length)
                hash = $("nz-list-item[id='" + AnchorList[this.Anchornum].poi_code + "']");
        } else {
            AnchorList = sli;
            let t = typeof value == 'string' ? value.slice(value.indexOf("-") + 1, value.length) : value.code;
            this.Anchornum = i && i < AnchorList.length - 1 ? i : this.Anchornum;
            this.Anchorname = AnchorList[this.Anchornum].sort + t;
            hash = $(".option nz-list-item[id='" + t + "']");
            this.ctrlup = hash.length > 1 && this.Anchornum > 0 ? true : false;
            this.ctrldown = hash.length > 1 && this.Anchornum != hash.length - 1 ? true : false;
        }
        let top = this.Anchornum <= hash.length - 1 ? hash[this.Anchornum].offsetTop : hash[0].offsetTop;
        let name = this.newFlow.partlist[this.selectedIndex].bpi_code;
        $("nz-list[id='" + name + "']").animate({ scrollTop: top }, 500);
    }
    /**工段判定 */
    Jurisdiction(sec) {
        const that = this;
        if (sec) {
            if (!that.bwi_list) { that.bwi_list = []; }
            let issec = that.bwi_list.find(bwi => bwi.key == sec.bwi_key);
            return !issec ? false : true;
        }
        return false;
    }
    /**工段选择
     * @param seckey 选中工段
     * @param num 工段排序
     * */
    sectionCheck(seckey, num) {
        this.nzSelected = seckey ? seckey.bwi_code : '';
        this.power.issdiction = this.Jurisdiction(seckey);
        if (!this.newFlow.partlist || this.newFlow.partlist === null) { this.newFlow.partlist = []; }
        // this.options = new Array();
        this.newFlow.partlist.forEach((part, pi) => {
            // const b = this.section.find(x => x.bwi_key === seckey.bwi_key);
            // if (!b) {
            // let _b = Object.assign({}, seckey, { bwi_sort: num, detaillist: [] })
            // this.section.push(_b);
            // this.newOP[part.bpi_code] = _b.detaillist;
            // } else {
            if (!part.detaillist || part.detaillist === null) { part.detaillist = []; }
            if (pi == this.selectedIndex) {
                this.options = new Array();
                this.StationAggregation = new Array();
            }
            part.detaillist.forEach((p, di) => {
                p.count = 1;
                if (p.schemelist && p.schemelist.length > 0) {
                    p.isscheme = true;
                    p.count++;
                    p.schemelist.forEach(ps => {
                        ps.schemenode = new Array()
                        this.OPSList.forEach(ops => {
                            ps[ops.field + 's'] = new Array()
                            let list = ps.schemedetail_list.filter(psd => psd.blr_key == ops.key)
                            if (list.length > 0) {
                                list.forEach(pspc => { ps[ops.field + 's'].push(pspc.value) })
                                ps.schemenode.push({ field: ops.field + 'list', name: ops.name })
                                ps[ops.field + 'list'] = list
                            }
                        })
                    })
                }
                if (p.helperlist && p.helperlist.length > 0) {
                    p.ishelp = true;
                    p.count++;
                }
                if (this.isoverload == true && p.overloadlist && p.overloadlist.length > 0) {
                    p.isoverload = true;
                    p.count++;
                }
                if (pi == this.selectedIndex) {
                    let _options: any = {
                        title: p.poi_name + '-' + p.poi_code,
                        name: p.poi_name, code: p.poi_code,
                        sort: di + 1
                    }
                    if (p.pyso_operationticket) { _options.pyso_operationticket = p.pyso_operationticket; }
                    this.options.push(_options)
                    if (p.routelist) {
                        p.routelist.forEach((dr, dri) => {
                            let tq = this.StationAggregation.findIndex(sa => sa.code == dr.bls_code)
                            if (tq >= 0) {
                                this.StationAggregation[tq].poi_list.push({
                                    poi_code: p.poi_code,
                                    poi_sort: di + 1,
                                    sort: dri + 1,
                                })
                            } else {
                                let _routes: any = {
                                    title: (dr.bls_name ? dr.bls_name : '') + '-' + dr.bls_code,
                                    name: dr.bls_name,
                                    code: dr.bls_code,
                                    poi_list: [{
                                        poi_code: p.poi_code,
                                        poi_sort: di + 1,
                                        sort: dri + 1,
                                    }],
                                    setstation: dr.bls_code
                                }
                                this.StationAggregation.push(_routes);
                                this.usedstation.push({ key: dr.bls_key, code: dr.bls_code });
                            }
                        })
                    }
                    if (p.overloadlist) {
                        p.overloadlist.forEach((po, poi) => {
                            let tq = this.StationAggregation.findIndex(sa => sa.code == po.bls_code)
                            if (tq >= 0) {
                                this.StationAggregation[tq].poi_list.push({
                                    poi_code: p.poi_code,
                                    poi_sort: di + 1,
                                    sort: poi + 1,
                                })
                            } else {
                                let _routes: any = {
                                    title: (po.bls_name ? po.bls_name : '') + '-' + po.bls_code,
                                    name: po.bls_name,
                                    code: po.bls_code,
                                    poi_list: [{
                                        poi_code: p.poi_code,
                                        poi_sort: di + 1,
                                        sort: poi + 1,
                                    }],
                                    setstation: po.bls_code
                                }
                                this.StationAggregation.push(_routes);
                                // this.usedstation.push({ key: ph.bls_key, code: ph.bls_code });
                            }
                            this.usedstation.push({ key: po.station_key, code: po.station_code });
                        })
                    }
                    if (p.helperlist) {
                        p.helperlist.forEach((ph, phi) => {
                            let tq = this.StationAggregation.findIndex(sa => sa.code == ph.bls_code)
                            if (tq >= 0) {
                                this.StationAggregation[tq].poi_list.push({
                                    poi_code: p.poi_code,
                                    poi_sort: di + 1,
                                    sort: phi + 1,
                                })
                            } else {
                                let _routes: any = {
                                    title: (ph.bls_name ? ph.bls_name : '') + '-' + ph.bls_code,
                                    name: ph.bls_name,
                                    code: ph.bls_code,
                                    poi_list: [{
                                        poi_code: p.poi_code,
                                        poi_sort: di + 1,
                                        sort: phi + 1,
                                    }],
                                    setstation: ph.bls_code
                                }
                                this.StationAggregation.push(_routes);
                                this.usedstation.push({ key: ph.bls_key, code: ph.bls_code });
                            }
                        })
                    }
                    if (p.schemelist) {
                        p.schemelist.forEach((ph, phi) => {
                            let tq = this.StationAggregation.findIndex(sa => sa.code == ph.bls_code)
                            if (tq >= 0) {
                                this.StationAggregation[tq].poi_list.push({
                                    poi_code: p.poi_code,
                                    poi_sort: di + 1,
                                    sort: phi + 1,
                                })
                            } else {
                                let _routes: any = {
                                    title: (ph.bls_name ? ph.bls_name : '') + '-' + ph.bls_code,
                                    name: ph.bls_name,
                                    code: ph.bls_code,
                                    poi_list: [{
                                        poi_code: p.poi_code,
                                        poi_sort: di + 1,
                                        sort: phi + 1,
                                    }],
                                    setstation: ph.bls_code
                                }
                                this.StationAggregation.push(_routes);
                                this.usedstation.push({ key: ph.bls_key, code: ph.bls_code });
                            }
                        })
                    }
                }
                if (p.psopd_key) { p.psopd_key = ''; }
                p.pfd_name = this.tipsMsg.noset;
                p.pod_name = this.tipsMsg.noset;
                p.title = '[' + p.poi_code + ']' + p.poi_name;
                if (!p.routelist) { p.routelist = []; }
                let total = p.routelist.reduce(function (total, currentValue, currentIndex, arr) {
                    return currentValue.percentage ? (total + currentValue.percentage) : total;
                }, 0);
                p.routelist.map((v) => { if (!v.percentage) { v.percentage = 0 }; v.percent = total > 0 ? ((v.percentage / total) * 100).toFixed(0) + '%' : '0%'; })
            });
            this.newOP[part.bpi_code] = part.detaillist;
            // }
        });
        this.isused();
        this.selectoeder = {}
    }
    /**预览 */
    preview() {
        const that = this;
        this.nzSelected = '';
        this.usedstation = new Array();
        this._service.comList('OperationProcessMaster/Extend/Preview', { popm_key: this.node.key }).then((sucess) => {
            this.newFlow = Object.assign({}, sucess);
            sucess.partlist.forEach((part, pi) => {
                if (!part || part === null) { return; }
                if (part.worksectionlist) {
                    that.newOP[part.bpi_code] = [];
                    that.options = new Array();
                    that.StationAggregation = new Array();
                    if (!this.section) { this.section = part.worksectionlist }
                    this.section.forEach((element, i) => {
                        if (element.bwi_key != '') {
                            let sec = part.worksectionlist.find(w => w.bwi_key == element.bwi_key);
                            if (sec) {
                                sec.detaillist.forEach((de, di) => {
                                    if (de.psopd_key) { de.psopd_key = ''; }
                                    that.options.push(de.poi_name + '-' + de.poi_code)
                                    de.routelist.forEach((dr, dri) => {
                                        let tq = this.StationAggregation.findIndex(sa => sa.code == dr.bls_code)
                                        if (tq >= 0) {
                                            this.StationAggregation[tq].poi_list.push({
                                                poi_code: de.poi_code,
                                                poi_sort: di + 1,
                                                sort: dri + 1,
                                            })
                                        } else {
                                            let _routes: any = {
                                                title: dr.bls_name + '-' + dr.bls_code,
                                                name: dr.bls_name,
                                                code: dr.bls_code,
                                                poi_list: [{
                                                    poi_code: de.poi_code,
                                                    poi_sort: di + 1,
                                                    sort: dri + 1,
                                                }],
                                                setstation: dr.bls_code
                                            }
                                            this.StationAggregation.push(_routes);
                                            this.usedstation.push({ key: dr.bls_key, code: dr.bls_code });
                                        }
                                    })
                                    if (de.overloadlist)
                                        de.overloadlist.forEach((po, poi) => {
                                            let tq = this.StationAggregation.findIndex(sa => sa.code == po.bls_code)
                                            if (tq >= 0) {
                                                this.StationAggregation[tq].poi_list.push({
                                                    poi_code: de.poi_code,
                                                    poi_sort: di + 1,
                                                    sort: poi + 1,
                                                })
                                            } else {
                                                let _routes: any = {
                                                    title: (po.bls_name ? po.bls_name : '') + '-' + po.bls_code,
                                                    name: po.bls_name,
                                                    code: po.bls_code,
                                                    poi_list: [{
                                                        poi_code: de.poi_code,
                                                        poi_sort: di + 1,
                                                        sort: poi + 1,
                                                    }],
                                                    setstation: po.bls_code
                                                }
                                                this.StationAggregation.push(_routes);
                                            }
                                            this.usedstation.push({ key: po.station_key, code: po.station_code });
                                        })
                                    if (de.helperlist) {
                                        de.helperlist.forEach((ph, phi) => {
                                            let tq = this.StationAggregation.findIndex(sa => sa.code == ph.bls_code)
                                            if (tq >= 0) {
                                                this.StationAggregation[tq].poi_list.push({
                                                    poi_code: de.poi_code,
                                                    poi_sort: di + 1,
                                                    sort: phi + 1,
                                                })
                                            } else {
                                                let _routes: any = {
                                                    title: (ph.bls_name ? ph.bls_name : '') + '-' + ph.bls_code,
                                                    name: ph.bls_name,
                                                    code: ph.bls_code,
                                                    poi_list: [{
                                                        poi_code: de.poi_code,
                                                        poi_sort: di + 1,
                                                        sort: phi + 1,
                                                    }],
                                                    setstation: ph.bls_code
                                                }
                                                this.StationAggregation.push(_routes);
                                                this.usedstation.push({ key: ph.bls_key, code: ph.bls_code });
                                            }
                                        })
                                    }
                                    if (de.schemelist) {
                                        de.schemelist.forEach((ph, phi) => {
                                            let tq = this.StationAggregation.findIndex(sa => sa.code == ph.bls_code)
                                            if (tq >= 0) {
                                                this.StationAggregation[tq].poi_list.push({
                                                    poi_code: de.poi_code,
                                                    poi_sort: di + 1,
                                                    sort: phi + 1,
                                                })
                                            } else {
                                                let _routes: any = {
                                                    title: (ph.bls_name ? ph.bls_name : '') + '-' + ph.bls_code,
                                                    name: ph.bls_name,
                                                    code: ph.bls_code,
                                                    poi_list: [{
                                                        poi_code: de.poi_code,
                                                        poi_sort: di + 1,
                                                        sort: phi + 1,
                                                    }],
                                                    setstation: ph.bls_code
                                                }
                                                this.StationAggregation.push(_routes);
                                                this.usedstation.push({ key: ph.bls_key, code: ph.bls_code });
                                            }
                                        })
                                    }
                                    that.newOP[part.bpi_code].push(de);
                                    if (!that.divider.find(d => d == sec.bwi_name)) {
                                        that.divider.push(sec.bwi_name);
                                    } else { that.divider.push(''); }
                                });
                            }
                        }
                    });
                }
            });
        })
        this.isused();
    }
    /**设置选择 */
    setcheckChange(record, event, key): number {
        if (!record.count) record.count = 1;
        if (!record.schemelist) record.schemelist = new Array();
        if (!record.helperlist) record.helperlist = new Array();
        if (!record.overloadlist) record.overloadlist = new Array();
        if (record.schemelist.length > 0 || record.helperlist.length > 0 || record.overloadlist.length > 0) {
            this.message.error(this.getTipsMsg('warning.plaseClearSHO'))
            record[key] = false;
            return record.count;
        }
        switch (key) {
            case 'isscheme':
                record.ishelp = false;
                record.isoverload = false;
                break;
            case 'ishelp':
                record.isscheme = false;
                record.isoverload = false;
                break;
            case 'isoverload':
                record.isscheme = false;
                record.ishelp = false;
                break;
            default:
                break;
        }
        // return record.count + (event == true ? 1 : -1);
        return event == true ? 2 : 1;
    }
    /**部件选择 */
    partSelect() {
        this.newFlow.partlist.map(n => {
            if (!this.newOP[n.bpi_code]) this.newOP[n.bpi_code] = new Array();
            this.newOP[n.bpi_code].forEach(d => { d.checked = false; });
        });
        this.selectoeder = {}
        // this.flowopall = new Array();
    }
    /**工序选择
     * @param opch 选中工序
     * @param par 当前部件
     */
    isShowPower(opch, par): boolean {
        if (this.nzSelected == '' || this.power.mappower == false) { return true; }
        // let show = par.worksectionlist.find(x => x.bwi_code == this.nzSelected);
        // let pwd = show ? show.detaillist : par.worksectionlist[0].detaillist;
        let pwd = par.detaillist;
        this.newOP[par.bpi_code].forEach(d => { d.checked = false; });
        pwd.forEach(d => { d.checked = false; });
        // if (this.power.mappower == true && this.routecalculation == "1") {
        if (this.power.mappower == true) {
            if (this.power.issdiction == true) {
                opch.checked = true;
                this.selectoeder = opch;
                return false;
            }
        }
        return true;
    }
    /**复制工序流 */
    CopyOp(type?, url = this.otherUrl.getFlow) {
        let m: any = {}
        let b: any = {}
        this.CopyProgress = true;
        this.getList(url, { bwi_key: this.copymodel.bwi_key, popm_key: this.copymodel.popm_key, bpi_key: this.copymodel.bpi_key })
        this.copymodel = {};
        this.copymodel.psi_key = this.psi_key ? this.psi_key : '';
        this.ishistory = true;
    }
    /**一键折叠 */
    Fold(par, i) {
        par.isfold = !par.isfold;
        this.newOP[par.bpi_code].forEach(nf => nf.checked = false)
    }
    /**一键清空路线图 */
    del_map(par) {
        this.Confirm('confirm.confirm_clean', '', (ev) => {
            if (ev == 'pass') {
                // par.worksectionlist.forEach(element => {
                //     element.detaillist.forEach(detail => { detail.routelist = []; })
                // });
                let _over = new Array()
                par.detaillist.forEach(detail => {
                    detail.routelist = [];
                    detail.helperlist = [];
                    detail.schemelist = [];
                    if (detail.overloadlist)
                        _over.push(...detail.overloadlist)
                })
                this._service.deleteModel('admin/schemeoverload/', _over, (s) => {
                    par.detaillist.forEach(detail => { if (detail.overloadlist) detail.overloadlist = []; })
                })
                this.message.success(this.getTipsMsg('sucess.s_clean'));
            }
        })
    }
    /**参数调整*/
    parameter(type, option, i, event, bpi_code, ex = '') {
        event.stopPropagation()
        const that = this;
        let parmodel = { part: option, originalsort: i, bpi_code: bpi_code };
        switch (type) {
            /**点击调整排序 */
            case 'sort':
                that.param.ordernumber = i + 1;
                that.param.orderList = parmodel;
                break;
            /**点击调整配比 */
            case 'percentage':
                that.param.percentage = option[i].percentage;
                that.param.name = option[i].bls_code;
                that.param.Station = parmodel;
                this.setvisible[bpi_code + i] = false;
                break;
            /**点击调整详情参数 */
            case 'Information':
                that.param.production_time = option[i].production_time;
                that.param.production_wages = option[i].production_wages;
                that.param.operation_requrement = option[i].operation_requrement;
                that.param.qc_requrement = option[i].qc_requrement;
                that.param.Information = parmodel;
                that.setvisible[bpi_code + parmodel.originalsort] = false;
                break;
        }
    }

    /**确认调整 */
    saveDetail(param, type) {
        const that = this;
        const orgigdata = param.part;
        const sortmodel = param.part[param.originalsort];
        switch (type) {
            /**点击调整排序 */
            case 'sort':
                if ((!this.param.ordernumber || this.param.ordernumber === null) && this.param.ordernumber - 1 !== 0) {
                    this.message.warning(this.getTipsMsg('inputdata.input_changenum'));
                    return;
                }
                if (this.param.ordernumber - 1 < 0) {
                    this.message.warning(this.getTipsMsg('warning.nrs'));
                    return;
                }
                this.Confirm('confirm.confirm_changenum', '', (ev) => {
                    if (ev == 'pass') {
                        orgigdata.splice(param.originalsort, 1);
                        orgigdata.splice(that.param.ordernumber - 1, 0, sortmodel);
                        orgigdata.forEach((md, s) => { md.sort = s; });
                    }
                });
                break;
            /**点击调整配比 */
            case 'percentage':
                if (UtilService.isNotEmpty(this.param.percentage) && this.param.percentage != 0) {
                    if (this.param.percentage < 0) {
                        this.message.warning(this.getTipsMsg('warning.mrs'));
                        return;
                    }
                    sortmodel.percentage = this.param.percentage;
                    let total = 0;
                    total = orgigdata.reduce(function (total, currentValue, currentIndex, arr) {
                        return currentValue.percentage ? (total + currentValue.percentage) : total;
                    }, 0);
                    orgigdata.map((v) => { v.percent = v.percent = total > 0 ? ((v.percentage / total) * 100).toFixed(2) + '%' : '0%'; })
                    this.setvisible[param.bpi_code + param.originalsort] = false;
                } else {
                    this.message.warning(this.getTipsMsg('warning.vrs'));
                }
                break;
            /**点击调整详情参数 */
            case 'Information':
                sortmodel.production_wages = that.param.production_wages;
                sortmodel.production_time = that.param.production_time;
                sortmodel.operation_requrement = that.param.operation_requrement;
                sortmodel.qc_requrement = that.param.qc_requrement;
                orgigdata[param.originalsort] = Object.assign(orgigdata[param.originalsort], sortmodel)
                this.setvisible[param.bpi_code + param.originalsort] = false;
                break;
        }
        this.ishistory = true
    }
    /**站位删除 */
    DelInfo(part, i, event, par?, sname?) {
        event.stopPropagation()
        const that = this;
        let name = '';
        const ordermodel = part[i];
        if (ordermodel && ordermodel.optyle) { name = this.getTipsMsg('placard.Systemprocedure'); }
        this.Confirm('confirm.confirm_deln', name + sname, (ev) => {
            if (ev == 'pass') {
                // let fi = this.flowopall.findIndex(f => f.poi_key == ordermodel.poi_key);
                // if (fi >= 0) this.flowopall.splice(fi, 1);
                // let fi = this.flowopall.findIndex(f => f.poi_name == ordermodel.poi_name);
                // if (fi >= 0) this.selectoeder = {};
                let si = this.StationAggregation.findIndex(s => s.code == ordermodel.bls_code);
                if (si >= 0) {
                    let soi = this.StationAggregation[si].poi_list.findIndex(s => s.poi_code == par.poi_code);
                    if (soi >= 0) this.StationAggregation[si].poi_list.splice(soi, 1);
                    if (this.StationAggregation[si].poi_list.length == 0) {
                        this.StationAggregation.splice(si, 1);
                        this.inputValue = '';
                        let ui = this.usedstation.findIndex(s => s.key == ordermodel.bls_key);
                        if (ui >= 0) this.usedstation.splice(ui, 1);
                    }
                }
                part.splice(i, 1);
                // let opi = that.options.findIndex(o => o.name == sname && o.sort == i + 1);
                // if (opi >= 0) { that.options.splice(opi, 1); }
                // if (!par && part.length > i) { that.doneto = part[this.selectedIndex].bpi_code; }
                // this.flowopall = new Array();
                // this.newFlow.partlist[this.selectedIndex].worksectionlist.forEach(pw => {
                //     this.flowopall.push(...pw.detaillist)
                //     this.flowopall = UtilService.uniq(this.flowopall)
                // })     
                // this.flowopall.push(...this.newFlow.partlist[this.selectedIndex].detaillist)
                // this.flowopall = UtilService.uniq(this.flowopall)
                let total = 0;
                total = part.reduce(function (total, currentValue, currentIndex, arr) {
                    return currentValue.percentage ? (total + currentValue.percentage) : total;
                }, 0);
                part.map((v) => { v.percent = total > 0 ? ((v.percentage / total) * 100).toFixed(2) + '%' : '0%'; })
                this.filteredOptions = this.StationAggregation;
                this.isused();
                this.ishistory = true;
            }
        });
    }
    /**工序删除
     * @param part 工序集合
     * @param i 工序所在排序
     * @param sname 工序名称
     * @param name 系统工序判断
     */
    DelOp(part, i, event, sname?, name = '') {
        event.stopPropagation();//禁止其他操作
        const ordermodel = part[i];//删除工序
        if (ordermodel && ordermodel.optyle) { name = this.getTipsMsg('placard.Systemprocedure'); }//判断是否是系统工序
        this.Confirm('confirm.confirm_deln', name + sname, (ev) => {//确认框
            if (ev == 'pass') {//确认返回
                if (ordermodel.overloadlist && ordermodel.overloadlist.length > 0) {
                    this.Confirm('confirm.confirm_overload', '', (ev) => {//确认框
                        if (ev == 'pass') {
                            this._service.deleteModel('admin/schemeoverload/', ordermodel.overloadlist, (r) => {
                                let fi = this.flowopall.findIndex(f => f.poi_name == ordermodel.poi_name);//查找部件中该工序排序
                                if (fi >= 0) this.selectoeder = {};//如果存在选中置空
                                part.splice(i, 1);//删除工序
                                let opi = this.options.findIndex(o => o.name == sname && o.sort == i + 1);//查找部件中该工序排序
                                if (opi >= 0) { this.options.splice(opi, 1); }//总工序集合删除备用数据
                                this.isused();
                            })
                        }
                    });
                } else {
                    let fi = this.flowopall.findIndex(f => f.poi_name == ordermodel.poi_name);//查找部件中该工序排序
                    if (fi >= 0) this.selectoeder = {};//如果存在选中置空
                    part.splice(i, 1);//删除工序
                    let opi = this.options.findIndex(o => o.name == sname && o.sort == i + 1);//查找部件中该工序排序
                    if (opi >= 0) { this.options.splice(opi, 1); }//总工序集合删除备用数据
                    this.isused();
                }
                this.ishistory = true
            }
        });
    }
    /**删除超载站 */
    DelOverload(part, pov, event, i) {
        event.stopPropagation()
        this.Confirm('confirm.confirm_deln', pov.station_code, (ev) => {
            if (ev == 'pass') {
                this._service.deleteModel('admin/schemeoverload/', [pov], (r) => {
                    part.splice(i, 1);
                })
                this.ishistory = true
            }
        })
    }
    /**上下调整 */
    bpimove(num: number, option, i) {
        const ordermodel = option[i];
        option.splice(i, 1);
        option.splice(i + num, 0, ordermodel);
        option.forEach((md, s) => { md.sort = s; });
        this.ishistory = true
    }
    /**站位禁用 */
    outof(pr, OP, ev, state) {
        ev.stopPropagation();
        if (state == 'stop')
            pr.percentage = 0;
        else
            pr.percentage = 1;
        let total = 0;
        total = OP.reduce(function (total, currentValue, currentIndex, arr) {
            return currentValue.percentage ? (total + currentValue.percentage) : total;
        }, 0);
        OP.map((v) => { v.percent = total > 0 ? ((v.percentage / total) * 100).toFixed(2) + '%' : '0%'; });
        this.ishistory = true
    }
    /**文字滚动 */
    mouseover(event, op) {
        let dom = document.getElementById(op.poi_code + "_" + op.sort);
        op.isscroll = dom.scrollWidth > dom.offsetWidth;
    }
    /**站位拖拽 */
    Disabled = false;
    lockAxis = false;
    /**拖动类型 */
    dragtype(event) {
        this.Disabled = event.item.dropContainer.id == "stodoList" ? true : false;
    }
    /**是否按下 */
    isDown: boolean = false;
    /**原始位置X */
    disX
    /**原始位置Y */
    disY
    /**记录拖行站位数据 */
    dragStation: any = {}
    /**站位移动开始 */
    dragStart(event, item) {
        if (!this.isDown) {
            this.isDown = true;
            event.preventDefault();
            this.dragStation = Object.assign({}, item)
            let { top, left } = $('.flow-box').offset()
            this.disX = left;
            this.disY = top;
        }
    }
    /**站位移动经过 */
    stationmove(ev) {
        if (this.isDown) {
            ev.stopPropagation();//禁止其他事件活动
            let _html = $('.drag-placeholder');
            let { x, y } = ev;
            _html.css({ 'display': 'unset', 'left': (x - this.disX) + 'PX', 'top': (y - this.disY + 2) + 'PX' })
            let toElem = $(document.elementFromPoint(ev.pageX - (document.body.scrollLeft || document.documentElement.scrollLeft),
                ev.pageY - (document.body.scrollTop || document.documentElement.scrollTop))); // 鼠标落点位置
            const _contain = toElem.closest('div.part-op');
            if (_contain.length > 0) {
                const _li = toElem.closest('div.OPheader');
                const index = _contain.find("div.OPheader").index(_li);
                let par = this.newFlow.partlist[this.selectedIndex];
                let oplist = this.newOP[par.bpi_code] ? this.newOP[par.bpi_code] : [];
                let OP = oplist[index];
                if (OP) {
                    if (OP.show == true) {
                        return
                    }
                    par.isfold = false;
                    oplist.forEach(nc => {
                        nc.checked = false;
                        nc.show = OP.poi_key == nc.poi_key ? true : false;
                    });
                    OP.checked = true;
                }
            }
        }
    }
    /**获取配置条件 */
    getOPS(OP?) {
        this._service.comList('LayoutStructureRules', { Module: 2 }).then(s => {
            this.OPSList = s.data
            // this.OPSList.forEach(ops => ops.poi_key = OP.poi_key)
        })
    }
    /**保存规则设置 */
    saveSetScheme() {
        let check = new Array();
        this.OPSList.forEach(cops => {
            if (cops.checked == true) {
                let { key } = cops
                check.push({ blr_key: key, poi_key: this.selectoeder.poi_key })
            }
        })
        if (check.length == 0) check.push({ poi_key: this.selectoeder.poi_key })
        this._service.saveModel('admin/OperationRule/Extend/batch', 'post', check, (sucss) => {
            this.message.success(this.getTipsMsg('sucess.s_set'));
            // this.OPSList.forEach(op => op.checked = false)
        })
    }
    /**获取工序规则 */
    getOperationRule(OP) {
        this._service.getList('admin/OperationRule/', { poi_key: OP.poi_key }, (sucess) => {
            this.OperationRule = sucess;
            this.OPSList.forEach(op => op.checked = false);
            let schemenode = new Array();
            this.OperationRule.forEach(pspc => {
                this.OPSList.forEach(op => {
                    if (pspc.blr_key == op.key) {
                        pspc.optionvalue = op.optionvalue;
                        pspc.optionmode = op.optionmode
                        if (pspc.optionmode == "customselect")
                            pspc.valueslist = pspc.optionvalue ? JSON.parse(pspc.optionvalue) : [];
                        op.checked = true
                    }
                })
                schemenode.push({ field: pspc.blr_field + 'list', name: pspc.blr_name })
            });
            if (OP.schemelist) {
                OP.schemelist.forEach(OPs => {
                    if (OPs.schemedetail_list) {
                        OPs.schemedetail_list = OPs.schemedetail_list.filter(o => this.OperationRule.find(op => o.blr_key == op.blr_key))
                    }
                    OPs.schemenode = schemenode;
                })
            }
        })
    }
    /**站位移动结束 */
    dragEnd(ev, data?, list?, drge: any = {}) {
        if (this.isDown) {
            $('.drag-placeholder').css({ 'display': 'none', 'left': 0 + 'px', 'top': 0 })
            ev.preventDefault();
            let toElem = $(document.elementFromPoint(ev.pageX - (document.body.scrollLeft || document.documentElement.scrollLeft),
                ev.pageY - (document.body.scrollTop || document.documentElement.scrollTop))); // 鼠标落点位置
            if (toElem.closest('div.station').length > 0) {
                drge = {
                    bls_key: this.dragStation.key,
                    bls_code: this.dragStation.code,
                    bls_name: this.dragStation.name,
                    percentage: this.dragStation.mixtureratio,
                    enable: true,
                    checked: false,
                    percent: '100%'
                };
                if (toElem.closest('#routelist').length > 0) {
                    if (this.routecalculation != "1") {
                        this.message.error(this.getTipsMsg('warning.NotApplicable'));
                        this.isDown = false;
                        return;
                    }
                    if (this.isoverload == true) {
                        this._service.comList('SchemeOverload/Extend/IsOverload', { Station_Key: this.dragStation.key }).then(v => {
                            this.dropadd(drge, data)
                        })
                    } else {
                        this.dropadd(drge, data);
                    }
                }
                if (toElem.closest('#schemelist').length > 0) {
                    // if (!data.routelist || data.routelist.length == 0) {
                    //     this.message.error(this.getTipsMsg('warning.PlaseAddStation'));
                    //     this.lockAxis = false;
                    //     return;
                    // }
                    let schemedrge = Object.assign(drge, { pci_list: [], psz_list: [] });
                    if (!data.schemelist) data.schemelist = new Array();
                    let containersch = data.schemelist;
                    let schtotal = 0;
                    schtotal = containersch.reduce(function (schtotal, currentValue) {
                        return currentValue.percentage ? (schtotal + currentValue.percentage) : schtotal;
                    }, 0);
                    schtotal = schtotal + schemedrge.percentage;
                    containersch.map((v) => { v.percent = schtotal > 0 ? ((v.percentage / schtotal) * 100).toFixed(2) + '%' : '0%'; })
                    schemedrge.percent = schtotal > 0 ? ((schemedrge.percentage / schtotal) * 100).toFixed(2) + '%' : '0%';
                    // if (data.schemelist.length > 0) { schemedrge.schemenode = data.schemelist[0].schemenode } else { this.getOperationRule(data) }
                    data.schemelist.push(schemedrge)
                    this.getOperationRule(data)
                    let tq = this.StationAggregation.findIndex(sa => sa.code == schemedrge.bls_code)
                    if (tq >= 0) {
                        this.StationAggregation[tq].poi_list.push({
                            poi_code: data.poi_code,
                            poi_sort: data + 1,
                            sort: (data.routelist ? data.routelist.length : 0) + 1,
                        })
                    } else {
                        let _routes: any = {
                            title: schemedrge.bls_name + '-' + schemedrge.bls_code,
                            name: schemedrge.bls_name,
                            code: schemedrge.bls_code,
                            poi_list: [{
                                poi_code: data.poi_code,
                                poi_sort: data.sort + 1,
                                sort: (data.routelist ? data.routelist.length : 0) + 1,
                            }],
                            setstation: schemedrge.bls_code
                        }
                        this.StationAggregation.push(_routes);
                        this.usedstation.push({ key: schemedrge.bls_key, code: schemedrge.bls_code, });
                    }
                }
                if (toElem.closest('#helplist').length > 0) {
                    if (!data||data.routelist.length == 0) {
                        this.message.error(this.getTipsMsg('warning.PlaseAddStation'));
                        this.lockAxis = false;
                        return;
                    }
                    if (!data.helperlist) data.helperlist = new Array();
                    if (data.helperlist && data.helperlist.length > 0) {
                        let helpIndex = data.helperlist.findIndex(r => r.bls_key == drge.bls_key);
                        if (helpIndex >= 0) {
                            this.message.error(this.getTipsMsg('warning.Standingposition'));
                            return;
                        }
                        let Index = data.routelist.findIndex(r => r.bls_key == drge.bls_key);
                        if (Index >= 0) {
                            this.message.error(this.getTipsMsg('warning.Practicalhelper'));
                            return;
                        }
                    }
                    let containerson = data.helperlist;
                    let total = 0;
                    total = containerson.reduce(function (total, currentValue, currentIndex, arr) {
                        return currentValue.percentage ? (total + currentValue.percentage) : total;
                    }, 0);
                    total = total + drge.percentage;
                    containerson.map((v) => { v.percent = total > 0 ? ((v.percentage / total) * 100).toFixed(2) + '%' : '0%'; })
                    drge.percent = total > 0 ? ((drge.percentage / total) * 100).toFixed(2) + '%' : '0%';
                    data.helperlist.push(drge)

                    let tqh = this.StationAggregation.findIndex(sa => sa.code == drge.bls_code)
                    if (tqh >= 0) {
                        this.StationAggregation[tqh].poi_list.push({
                            poi_code: data.poi_code,
                            poi_sort: data + 1,
                            sort: (data.routelist ? data.routelist.length : 0) + 1,
                        })
                    } else {
                        let _routes: any = {
                            title: drge.bls_name + '-' + drge.bls_code,
                            name: drge.bls_name,
                            code: drge.bls_code,
                            poi_list: [{
                                poi_code: data.poi_code,
                                poi_sort: data.sort + 1,
                                sort: (data.routelist ? data.routelist.length : 0) + 1,
                            }],
                            setstation: drge.bls_code
                        }
                        this.StationAggregation.push(_routes);
                        this.usedstation.push({ key: drge.bls_key, code: drge.bls_code, });
                    }
                }
                if (toElem.closest('#overload').length > 0) {
                    if (data.routelist.length == 0) {
                        this.message.error(this.getTipsMsg('warning.PlaseAddStation'));
                        this.lockAxis = false;
                        return;
                    }
                    let overload: any = {
                        psopm_key: this.newFlow.psopm_key ? this.newFlow.psopm_key : this.node.key,
                        popm_key: this.newFlow.psopm_key ? this.newFlow.psopm_key : this.node.key,
                        psi_key: this.psi_key,
                        poi_key: data.poi_key,
                        station_key: this.dragStation.key,
                        station_code: this.dragStation.code,
                        station_name: this.dragStation.name,
                        pkey_code: this.dragStation.pkey_code,
                    }
                    if (!data.overloadlist || data.overloadlist == null) data.overloadlist = new Array();
                    let t: boolean;
                    list.forEach((l) => {
                        if (l.routelist.find(s => s.bls_key == this.dragStation.key)) {
                            t = true;
                            return
                        }
                    })
                    if (t == true) {
                        this._modalService.confirm({
                            nzTitle: this.getTipsMsg('confirm.confirm_schemeoverload'),
                            nzContent: '',
                            nzOnOk: () => {
                                overload.iscover = true;
                                this._service.saveModel('admin/schemeoverload/', 'post', overload, (r) => {
                                    overload = Object.assign(overload, r)
                                    this.message.success(this.getTipsMsg('sucess.s_update'));
                                    this.StationAggregation = this.StationAggregation.filter(s => s.code != this.dragStation.code);
                                    this.usedstation.push({ key: overload.station_key, code: overload.station_code });
                                    this.usedstation = UtilService.uniq(this.usedstation)
                                    if (!data.routelist) { data.routelist = [] }
                                    list.forEach((l) => {
                                        if (!l.routelist) { l.routelist = [] }
                                        l.routelist = l.routelist.filter(s => s.bls_key != overload.station_key);
                                        l.overloadlist = l.overloadlist.filter(s => s.station_key != overload.station_key);
                                    })
                                    data.overloadlist.push(overload)
                                });
                            }
                        });
                    } else {
                        this._service.saveModel('admin/schemeoverload/', 'post', overload, (r) => {
                            overload = Object.assign(overload, r)
                            this.usedstation.push({ key: overload.station_key, code: overload.station_code });
                            this.usedstation = UtilService.uniq(this.usedstation)
                            this.message.success(this.getTipsMsg('sucess.s_update'));
                            data.overloadlist.push(overload)
                        }, (err) => {
                            if (err.status_code == 10) {
                                this._modalService.confirm({
                                    nzTitle: this.getTipsMsg('confirm.confirm_schemeoverload'),
                                    nzContent: '',
                                    nzOnOk: () => {
                                        overload.iscover = true;
                                        this._service.saveModel('admin/schemeoverload/', 'post', overload, (r) => {
                                            overload = Object.assign(overload, r)
                                            this.message.success(this.getTipsMsg('sucess.s_update'));
                                            this.StationAggregation = this.StationAggregation.filter(s => s.code != this.dragStation.code);
                                            list.forEach((l) => {
                                                if (!l.routelist) { l.routelist = [] }
                                                l.routelist = l.routelist.filter(s => s.bls_key != overload.station_key);
                                                l.overloadlist = l.overloadlist.filter(s => s.station_key != overload.station_key);
                                            })
                                            data.overloadlist.push(overload)
                                        });
                                    }
                                });
                            }
                        })
                    }
                }
                this.Disabled = false;
                this.isused();
            }
            // else {
            //     this.message.error('请在正确位置添加站位！');
            // }
            this.isDown = false;
            this.ishistory = true
        }
    }
    /**拖拽站位添加 */
    dropadd(stationdrags, contdata) {
        if (!stationdrags.mixtureratio || stationdrags.mixtureratio === null) {
            stationdrags.mixtureratio = 0;
        }
        if (contdata.helperlist && contdata.helperlist.length > 0) {
            let helpIndex = contdata.helperlist.findIndex(r => r.bls_key == stationdrags.bls_key);
            if (helpIndex >= 0) {
                this.message.error(this.getTipsMsg('warning.Standingposition'));
                return;
            }
        }
        if (UtilService.isNotEmpty(stationdrags.mixtureratio) || stationdrags.mixtureratio == 0) {
            if (stationdrags.mixtureratio < 0) {
                this.message.error(this.getTipsMsg('warning.vrs'));
                this.lockAxis = false;
                return;
            }
            let containerson = contdata.routelist;
            if (!containerson || containerson == null) { containerson = []; }
            let Index = containerson.findIndex(r => r.bls_key == stationdrags.bls_key);
            if (Index >= 0) {
                this.message.warning(this.getTipsMsg('warning.Standingposition'));
                this.lockAxis = false;
                return;
            }
            let total = 0;
            total = containerson.reduce(function (total, currentValue, currentIndex, arr) {
                return currentValue.percentage ? (total + currentValue.percentage) : total;
            }, 0);
            total = total + stationdrags.percentage;
            containerson.map((v) => { v.percent = total > 0 ? ((v.percentage / total) * 100).toFixed(2) + '%' : '0%'; })
            stationdrags.percent = total > 0 ? ((stationdrags.percentage / total) * 100).toFixed(2) + '%' : '0%';
            containerson.push(stationdrags)
            this.Disabled = false
            let tq = this.StationAggregation.findIndex(sa => sa.code == stationdrags.bls_code)
            if (tq >= 0) {
                this.StationAggregation[tq].poi_list.push({
                    poi_code: contdata.poi_code,
                    poi_sort: contdata + 1,
                    sort: (contdata.routelist ? contdata.routelist.length : 0) + 1,
                })
            } else {
                let _routes: any = {
                    title: stationdrags.bls_name + '-' + stationdrags.bls_code,
                    name: stationdrags.bls_name,
                    code: stationdrags.bls_code,
                    poi_list: [{
                        poi_code: contdata.poi_code,
                        poi_sort: contdata.sort + 1,
                        sort: (contdata.routelist ? contdata.routelist.length : 0) + 1,
                    }],
                    setstation: stationdrags.bls_code
                }
                this.StationAggregation.push(_routes);
                this.usedstation.push({ key: stationdrags.bls_key, code: stationdrags.bls_code, });
            }
            this.ishistory = true
        }
    }
    /**指针经过 */
    dragMoved(e) {
        this.lockAxis = true;
    }
    // cloned: any;
    /**工序展示 */
    opShow(event, OP, newOP, par) {
        event.stopPropagation()
        if (OP.show == true) {
            OP.show = !OP.show;
            return
        }
        par.isfold = false;
        let check = OP.checked;
        newOP.forEach(nc => {
            nc.checked = false;
            nc.show = OP.poi_key == nc.poi_key ? !nc.show : false;
        });
        OP.checked = true;
    }
    /**复制上一工序站位 */
    inherit(ev, i, oplist) {
        let after = oplist[i - 1]
        oplist[i].routelist = new Array();
        oplist[i].schemelist = new Array();
        // oplist[i].routelist = oplist[i].routelist.concat();
        after.routelist.forEach(rl => {
            let newrl = Object.assign({}, rl, { poi_key: oplist[i].poi_key, poi_name: oplist[i].poi_name, poi_code: oplist[i].poi_code })
            oplist[i].routelist.push(newrl)
        })
        after.schemelist.forEach(rl => {
            let newrl = Object.assign(rl, { poi_key: oplist[i].poi_key, poi_name: oplist[i].poi_name, poi_code: oplist[i].poi_code })
            oplist[i].schemelist.push(newrl)
        })
        after.helperlist.forEach(rl => {
            let newrl = Object.assign({}, rl, { poi_key: oplist[i].poi_key, poi_name: oplist[i].poi_name, poi_code: oplist[i].poi_code })
            oplist[i].helperlist.push(newrl)
        })
        this.ishistory = true
    }
    /**放条件判断 */
    isDrop(id) {
        if (!id || id.buttons <= 0) { return }
        let sec = this.section.find(s => s.bwi_code == this.nzSelected);
        if (!sec) {
            this.message.error(this.getTipsMsg('checkdata.check_seckey'));
            return false;
        }
        if (this.nzSelected == '') {
            this.message.error(this.getTipsMsg('warning.cannotup'));
            return false;
        }
        if (this.power.issdiction == false && !this.record.fromPage) {
            this.message.error(this.getTipsMsg('warning.noJurisdiction'));
            return false;
        }
        if (!this.newFlow.partlist || this.newFlow.partlist.length <= 0) {
            this.message.error(this.getTipsMsg('checkdata.check_part'));
            return false;
        }
        return true;
    }
    /**放 */
    drop(event: CdkDragDrop<any[] | undefined>, list?, par?) {
        if (this.power.flowpower != true) { this.lockAxis = false; return };
        // if (this.doneto == 'doneList') { return }
        if (this.isDrop(event.previousContainer.id) == false) { this.lockAxis = false; return }
        if (event.previousContainer === event.container) {
            moveItemInArray(list, event.previousIndex, event.currentIndex);
        } else {
            const that = this;
            /**是否重复 */
            let isrepeat: boolean;
            /**拖出对象 */
            let data: any = event.previousContainer.data[event.previousIndex];
            // let data: any = (event.previousContainer.data instanceof Array == true ? event.previousContainer.data : event.previousContainer.data['cachedData'])[event.previousIndex];
            if (event.previousContainer.data instanceof Array != true) {
                // const _code = document.getElementsByClassName('list-item')[event.item.data]['id'];
                // data = event.previousContainer.data['cachedData'][.find(epd => epd.code == _code)];
                data = event.previousContainer.data['cachedData'][event.item.data];
            }
            /**放入对象 */
            let container: any = event.container.data;
            // 全工段工序判重
            for (let i of par.detaillist) {
                if (data.key === i.poi_key && data.style == 1000) {
                    isrepeat = true;
                    // if (!par.bwi_name || par.bwi_name == '') {
                    //     let _section = that.section.find(se => se.bwi_key == par.bwi_key);
                    //     if (_section) { par.bwi_name = _section.bwi_name; }
                    // }
                    that.message.error(that.getTipsMsg('warning.repeatoption'));
                    this.lockAxis = false;
                    return;
                }
            }
            if (isrepeat == true) { this.lockAxis = false; return; }
            const smodel = this.opParameter.optyle.find(x => x.value === data.style);
            list.forEach(lc => lc.checked = false)
            let opmodel = {
                poi_key: data.key,
                poi_name: data.name,
                poi_code: data.code,
                poi_style: data.style,
                production_time: data.standard_time,
                production_wages: data.standard_wages,
                operation_requrement: data.requrement,
                qc_requrement: data.qc_requrement,
                routelist: [],
                helperlist: [],
                schemelist: [],
                overloadlist: [],
                checked: true,
                optyle: smodel,
                isscheme: false,
                ishelp: false,
                isoverload: false,
                sort: event.currentIndex
            }
            let drge = [opmodel];
            // let show = par.worksectionlist.find(x => x.bwi_code == this.nzSelected);
            if (!par.detaillist) { par.detaillist = [] }
            par.detaillist = list;
            this.selectoeder = opmodel;
            transferArrayItem(drge, container, 0, event.currentIndex);
            let _options: any = {
                title: data.name + '-' + data.code,
                name: data.name, code: data.code,
                sort: event.currentIndex
            }
            if (data.pyso_operationticket) { _options.pyso_operationticket = data.pyso_operationticket; }
            that.options.push(_options);

            this.flowopall.push(opmodel)
            this.flowopall = UtilService.uniq(this.flowopall)
            // }
        }
        // this.cloned = null
        this.lockAxis = false;
        this.ishistory = true
        // return;
    }
    /**工序添加 */
    opAdd(ev) {
        if (this.isDrop('todoList') == false) { return }
        /**是否重复 */
        let isrepeat: boolean;
        let par = this.newFlow.partlist[this.selectedIndex]
        const smodel = this.opParameter.optyle.find(x => x.value === ev.style);
        if (par.detaillist && par.detaillist.length > 0) {
            for (let i of par.detaillist) {
                if (ev.key === i.poi_key && ev.style == 1000) {
                    isrepeat = true;
                    if (!i.bwi_name || i.bwi_name == '') {
                        let _section = this.section.find(se => se.bwi_key == i.bwi_key);
                        if (_section) { i.bwi_name = _section.bwi_name; }
                    }
                    this.message.error(this.getTipsMsg('warning.Processexistence') + i.bwi_name);
                    this.lockAxis = false;
                    return;
                }
            }
        }
        if (isrepeat == true) { this.lockAxis = false; return; }
        let _section = this.section.find(se => se.bwi_code == this.nzSelected);
        let sort = this.newOP[par.bpi_code].findIndex(ns => ns.checked == true)
        if (sort < 0) { sort = this.newOP[par.bpi_code].length - 1 }
        let _node = {
            poi_key: ev.key,
            poi_name: ev.name,
            poi_code: ev.code,
            poi_style: ev.style,
            production_time: ev.standard_time,
            production_wages: ev.standard_wages,
            operation_requrement: ev.requrement,
            qc_requrement: ev.qc_requrement,
            bwi_code: _section.bwi_code,
            bwi_name: _section.bwi_name,
            bwi_key: _section.bwi_key,
            routelist: [],
            helperlist: [],
            schemelist: [],
            overloadlist: [],
            checked: true,
            optyle: smodel,
            sort: sort + 1
        }
        this.newOP[par.bpi_code].splice(sort + 1, 0, _node)
        this.newOP[par.bpi_code].forEach(lc => {
            lc.checked = ev.key == lc.poi_key ? true : false;
            if (ev.key == lc.poi_key)
                this.selectoeder = lc;
        })
        if (!par.detaillist) { par.detaillist = [] }
        par.detaillist = this.newOP[par.bpi_code];
        let _options: any = {
            title: ev.name + '-' + ev.code,
            name: ev.name, code: ev.code,
            sort: sort + 1
        }
        if (ev.pyso_operationticket) { _options.pyso_operationticket = ev.pyso_operationticket; }
        this.options.push(_options);
        this.flowopall.push(_node)
        this.flowopall = UtilService.uniq(this.flowopall)
        this.ishistory = true
    }
    /**站位添加 */
    Add(data) {
        let drge: any = {};
        if (this.routecalculation != "1") {
            this.message.error(this.getTipsMsg('warning.NotApplicable'));
            return;
        }
        if (!data.mixtureratio || data.mixtureratio === null) { data.mixtureratio = 0; }
        if (UtilService.isEmpty(data.mixtureratio)) {
            this.message.error(this.getTipsMsg('warning.vrs'));
            return;
        }
        drge = { bls_key: data.key, percentage: data.mixtureratio, bls_code: data.code, pkey_code: data.pkey_code, checked: false };

        if (drge.percentage < 0) {
            this.message.error(this.getTipsMsg('warning.mrs'));
            return;
        }
        console.log(this.selectoeder)
        if (this.selectoeder) {
            if (!this.selectoeder.poi_code) {
                this.message.error(this.getTipsMsg('checkdata.check_setop'));
                return;
            }
            let datalist = this.selectoeder.routelist;
            if (!datalist) { datalist = new Array() }
            let op = datalist.find(d => d.bls_key === drge.bls_key);
            if (op) {
                this.message.warning(this.getTipsMsg('warning.Standingposition'));
                return;
            }

            if (this.isoverload == true) {
                this._service.comList('SchemeOverload/Extend/IsOverload', { Station_Key: data.key }).then(v => {
                    this.addstation(datalist, drge, data)
                })

            } else {
                this.addstation(datalist, drge, data)
            }
            this.ishistory = true
        }
    }
    addstation(datalist, drge, data) {
        datalist.push(drge);
        let total = 0;
        total = datalist.reduce(function (total, currentValue, currentIndex, arr) {
            return currentValue.percentage ? (total + currentValue.percentage) : total;
        }, 0);
        datalist.map((v) => { v.percent = total > 0 ? ((v.percentage / total) * 100).toFixed(2) + '%' : '0%'; })
        this.selectoeder.routelist = datalist;
        let tq = this.StationAggregation.findIndex(sa => sa.code == data.bls_code || sa.code == data.code)
        if (tq >= 0) {
            this.StationAggregation[tq].poi_list.push({
                poi_code: this.selectoeder.poi_code,
                poi_sort: this.selectoeder.sort + 1,
                sort: datalist.length,
            })
        } else {
            let _routes: any = {
                title: data.name + '-' + data.code,
                name: data.name,
                code: data.code,
                poi_list: [{
                    sort: datalist.length,
                    poi_code: this.selectoeder.poi_code,
                    poi_sort: this.selectoeder.sort + 1
                }],
                setstation: data.code
            }
            this.StationAggregation.push(_routes);
            this.usedstation.push({ key: data.key, code: data.code });
            this.isused();
        }
        this.ishistory = true
    }
    /**超载站添加 */
    Addoverload(data) {
        if (this.selectoeder) {
            if (!this.selectoeder.poi_code) {
                this.message.error(this.getTipsMsg('checkdata.check_setop'));
                return;
            }
            if (!this.selectoeder.routelist || this.selectoeder.routelist.length <= 0) {
                this.message.error(this.getTipsMsg('warning.PlaseAddStation'));
                return;
            }
            let drge = {
                psopm_key: this.newFlow.psopm_key ? this.newFlow.psopm_key : this.node.key,
                pkey_code: data.pkey_code,
                checked: false,
                iscover: false,
                psi_key: this.psi_key,
                poi_key: this.selectoeder.poi_key,
                station_key: data.key,
                station_code: data.code,
                station_name: data.name
            };
            let datalist = this.selectoeder.overloadlist;
            if (!datalist) { datalist = new Array(); }
            let op = datalist.find(d => d.station_key === drge.station_key);
            if (op) {
                this.message.warning(this.getTipsMsg('warning.Standingposition'));
                return;
            }
            let t: boolean;
            this.newOP.forEach((l) => {
                if (t == true) { return; }
                l.forEach((k) => {
                    if (k.routelist.find(s => s.bls_key == data.key)) {
                        t = true;
                        return
                    }
                });
            })
            let bpi_code = this.newFlow.partlist[this.selectedIndex].bpi_code;
            let i = this.newOP[bpi_code].findIndex(nb => nb.poi_key == this.selectoeder.poi_key);
            if (t == true) {
                this._modalService.confirm({
                    nzTitle: this.getTipsMsg('confirm.confirm_schemeoverload'),
                    nzContent: '',
                    nzOnOk: () => {
                        drge.iscover = true;
                        this._service.saveModel('admin/schemeoverload/', 'post', drge, (r) => {
                            drge = Object.assign(drge, r)
                            this.message.success(this.getTipsMsg('sucess.s_update'));
                            datalist.push(drge)
                            this.selectoeder.overloadlist = datalist;
                            this.StationAggregation = this.StationAggregation.filter(s => s.code != data.code);
                            this.newOP.forEach((l) => {
                                if (t == true) { return; }
                                l.forEach((k) => {
                                    if (!k.routelist) { k.routelist = [] }
                                    k.routelist = k.routelist.filter(s => s.bls_key != data.key);
                                });
                            })
                        });
                    }
                });
            } else {
                this._service.saveModel('admin/schemeoverload/', 'post', drge, (r) => {
                    drge = Object.assign(drge, r);
                    this.message.success(this.getTipsMsg('sucess.s_update'));
                    datalist.push(drge)
                    this.selectoeder.overloadlist = datalist;
                    this.usedstation.push({ key: data.key, code: data.code });
                    this.isused();
                }, (err) => {
                    if (err.status_code == 10) {
                        this._modalService.confirm({
                            nzTitle: this.getTipsMsg('confirm.confirm_schemeoverload'),
                            nzContent: '',
                            nzOnOk: () => {
                                drge.iscover = true;
                                this._service.saveModel('admin/schemeoverload/', 'post', drge, (r) => {
                                    drge = Object.assign(drge, r)
                                    this.message.success(this.getTipsMsg('sucess.s_update'));
                                    datalist.push(drge)
                                    this.selectoeder.overloadlist = datalist;
                                    this.StationAggregation = this.StationAggregation.filter(s => s.code != data.code);
                                    this.newOP.forEach((l) => {
                                        if (t == true) { return; }
                                        l.forEach((k) => {
                                            if (!k.routelist) { k.routelist = [] }
                                            k.routelist = k.routelist.filter(s => s.bls_key != data.key);
                                        });
                                    })
                                });
                            }
                        });
                    }
                })
            }
        }
        this.ishistory = true
    }
    /**工序流平衡 */
    balance() {
        // let partlist = new Array();
        // this.newFlow.partlist.forEach(item => {
        //     let station = new Array();
        //     let oplist = new Array();
        //     item.worksectionlist.forEach(w => {
        //         if (w.detaillist) {
        //             w.detaillist.forEach(d => {
        //                 let o = Object.assign({}, { name: d.poi_name, code: d.poi_code, time: d.production_time, station: [] })
        //                 if (d.routelist) {
        //                     d.routelist.forEach(r => {
        //                         let Streamline = { poi_name: d.poi_name, poi_code: d.poi_code, time: (d.production_time / d.routelist.length) * r.percentage, percentage: r.percentage }
        //                         let s = station.find(s => s.code == r.bls_code);
        //                         if (!s) {
        //                             let body = Object.assign({}, { code: r.bls_code }, { oplist: [Streamline] })
        //                             station.push(body);
        //                         } else {
        //                             s.oplist.push(Streamline);
        //                         }
        //                         o.station.push({ code: r.bls_code, percentage: r.percentage })
        //                     });
        //                 }
        //                 oplist.push(o)
        //             });
        //         }
        //     });
        //     partlist.push({ bpi_code: item.bpi_code, station: station, oplist: oplist });
        // });
        // if (partlist.length > 0)
        //     this._Balance.open({ title: 'placard.balance', node: partlist })
    }
    /**站位规则设置 */
    stationset() {
        this._stationSet.open({ title: 'placard.stationset', node: this.newFlow })
    }
    /**关联站位 */
    setstation(OP) {
        this.selectoeder = Object.assign({}, OP);
        let operation = { key: OP.poi_key, code: OP.poi_code, name: OP.poi_name }
        this._website.open({ title: 'Associated', node: operation })
    }
    returnWebsite(OP) {
        let par = this.newFlow.partlist[this.selectedIndex];
        let oi = this.newOP[par.bpi_code].findIndex(i => i.key == this.selectoeder.key)
        this._service.comList('OperationStructureRelation', { poi_key: OP.poi_key }, 'getlist').then((result) => {
            this.newOP[par.bpi_code][oi].routelist = new Array();
            result.forEach(v => {
                this.newOP[par.bpi_code][oi].routelist.push({ bls_key: v.bls_key, percentage: v.mixtureratio, bls_code: v.bls_code, checked: false })
            });
            let total = 0;
            total = this.newOP[par.bpi_code][oi].routelist.reduce(function (total, currentValue, currentIndex, arr) {
                return currentValue.percentage ? (total + currentValue.percentage) : total;
            }, 0);
            this.newOP[par.bpi_code][oi].routelist.map((v) => { v.percent = total > 0 ? ((v.percentage / total) * 100).toFixed(2) + '%' : '0%'; })
            this.selectoeder = {};
        });
    }
    /**导入 */
    impflow() {
        this._imp.open({ title: 'import', node: { key: this.node.key } })
    }
    /**下载报表 */
    Expflow() {
        let params: any = {};
        if (!this.node.key) { return; }
        params = Object.assign({}, { key: this.node.key });
        const nowdate = this.getTipsMsg('btn.flowexport') + UtilService.dateFormat(new Date(), 'yyyy-MM-dd') + '.xls';
        const downloadUrl = environment.baseUrl + '/public/OperationProcessMaster/leadingout/';
        this._httpservice.download(downloadUrl, nowdate, params);
    }
    change(ev, item, { blr_field, blr_key, blr_name, optionmode }) {
        if (ev) {
            item[blr_field + 'list'] = new Array()
            if (!item.schemedetail_list) item.schemedetail_list = new Array();
            item.schemedetail_list = item.schemedetail_list.filter(s => s.blr_key != blr_key)
            ev.forEach(pc => {
                if (pc) {
                    let body: any = {};
                    if (optionmode == 'enumselect') {
                        body.value = pc.value;
                        body.value_name = pc.description;
                    } else if (optionmode == "customselect") {
                        body.value = pc.value;
                        body.value_name = pc.name;
                    } else {
                        body.value = pc.key;
                        body.value_name = pc.name;
                    }
                    item[blr_field + 'list'].push(body);
                    if (!item.schemedetail_list.find(is => is.value == pc.key))
                        item.schemedetail_list.push({ blr_field: blr_field, blr_key: blr_key, blr_name: blr_name, value: pc.key, value_name: pc.name })
                }
            })
            if (!item.schemenode) item.schemenode = new Array();
            if (!item.schemenode.find(is => is.field == blr_field + 'list'))
                item.schemenode.push({ field: blr_field + 'list', name: blr_name })
        }
    }
    getpw() {
        this._service.getModel('admin/OperationProcessMaster/', this.copymodel.popm_key, (s) => {
            this.copymodel.worksectionlist = s.worksectionlist;
            this.copymodel.partlist = s.partlist;
        })
    }
    /**保存 */
    submitForm(event?: KeyboardEvent) {
        if (this.timestamp > 0) {
            let newtime = new Date().getTime();
            if (newtime - this.timestamp <= 1000) {
                this.timestamp = new Date().getTime();
                return
            }
        }
        if (this.ishistory == true) {
            this._modalService.confirm({
                nzTitle: '工序流存在修改，是否确认保存？',
                nzContent: '',
                nzOnOk: () => { this.OnOk(event) }
            })
        } else {
            this.OnOk(event)
        }
    }
    OnOk(event?: KeyboardEvent) {
        this.timestamp = new Date().getTime();
        const that = this;
        this.submiting = true;
        if (that.section.length < 1) {
            this.message.error(this.getTipsMsg('checkdata.check_seckey'));
            this.submiting = false;
            return;
        }
        if (this.newFlow.partlist.length <= 0) {
            this.message.error(this.getTipsMsg('checkdata.check_part'));
            this.submiting = false;
            return;
        }
        this.newFlow.partlist.forEach(par => {
            par.detaillist.forEach((de, l) => { de.sort = l; });
        });
        this.newFlow = Object.assign(this.newFlow, { popm_key: this.node.key, bwi_key: this.node.bwi_key });
        super.save({ model: this.newFlow, url: 'admin/OperationProcessMaster/Extend/SaveDetail/', isClose: false, doAction: 'post' }, () => {
            this.submiting = false;
            this.isRefreshFlow = false;
            this.ishistory = false;
        }, false)
    }
    /**关闭 */
    close(isout = true): void {
        this.avatar = null
        this.visible = false;
        this.newFlow = new Array();
        // this.newmodel = {};
        this.selectoeder = {};
        this.submiting = false;
        this.section = new Array();
        this.pormType = new Array();
        this.flowopall = new Array();
        this.usedstation = new Array();
        this.listSelectedIndex = 0;
        this.inputValue = null;
        this.filteredOptions = new Array();
        this.bwi_list.forEach(b => b.hidd = false);
        this.nzSelected = '';
        this.ishistory = false;
        this.isRefreshFlow = true;
        if (isout == true) this.editDone.emit(true);
    }
    /**返回操作 */
    return(ev?) {
        this.record = Object.assign(this.record, { node: this.node, isreturn: true })
        this.onReturn.emit({ action: 'return', node: this.record });
        this.close(false);
    }
    /**返回复制页 */
    copy(ev) {
        // if (this.copymodel.name == '') {
        //     this.message.error('请输入名称')
        //     return
        // }
        // this.copymodel = Object.assign(this.copymodel, { key: this.node.key })
        // super.save({ url: 'admin/OperationProcessMaster/Extend/Copy/', model: this.copymodel, doAction: 'post' }, (result) => {
        //     if (result) {
        //         this.message.success('复制成功！')
        //         this.node.key = result;
        //         this.binding()
        //     }
        // }, false);
        let record = Object.assign({}, this.record, { action: 'copy', node: this.node, title: 'copy' })
        this.onReturn.emit({ action: 'copyset', node: record });
        this.close();
    }
    /**绑定 */
    binding(event?) {
        if (this.power.type != 'W') {//判断是否是作业单进入
            //款式绑定
            this._service.saveModel(this.otherUrl.StyleSave, 'post', { popm_key: this.node.key, psi_key: this.psi_key })
        } else {
            //作业单绑定
            this._service.saveModel(this.otherUrl.WorkBillSave, 'post', { pwb_key: this.record.other_node.key, popm_key: this.node.key, psi_key: this.psi_key })
        }
        this.record = Object.assign(this.record, { action: 'flowLamin', title: 'PWRM', node: this.node })
        this._service.getModel('admin/OperationProcessMaster/', this.node.key, (s) => {//获取绑定工序流数据
            this.record.worksectionlist = s.worksectionlist;
            if (s.worksectionlist.length > 0) { this.record.node.bwi_key = s.worksectionlist[0].bwi_key }
            this.open(this.record)//重新打开页面

        })
    }
    // 绑定 sku 工序流
    bindingSkuProcess() {
        this._service.getModel('admin/OperationProcessMaster/', this.node.key, (s) => {//获取绑定工序流数据
            this.record.worksectionlist = s.worksectionlist;
            if (s.worksectionlist.length > 0) { this.record.node.bwi_key = s.worksectionlist[0].bwi_key }
            this.executeSkuProcessTask(this.node.key)
        })
    }

    executeSkuProcessTask(popm_key) {
        const params = {
            popm_key,
            key: this.record.skuProcessParams.key,
            blsd_list: this.record.skuProcessParams.condtions.blsd_list
        }
        this.sps.saveSkuProcess(params).then(() => {
            this.message.success(this.getTipsMsg('sucess.s_sku_binding_process'));
            this._service.getModel(
                'admin/OperationProcessMaster/',
                popm_key,
                (data) => {
                    const { key, name, worksectionlist } = data;
                    const record = {
                        title: 'PWRM',
                        node: {
                            key,
                            name,
                            ...(worksectionlist.length && {
                                bwi_key: worksectionlist[0].bwi_key,
                            }),
                        },
                        worksectionlist,
                    };
                    this.sps.subscription$.next();
                    this.open(record);
                }
            );
        })
    }

    onReturnMainPage() {
        const record = {
            title: 'PWRM',
            fromPage: 'flow3',
            action: 'copy',
            skuProcessParams: this.record.skuProcessParams
        }
        this.sps.subscription$.next();
        this.onReturn.emit(record);
        this.close(false);
    }

    /**工序流解绑并返回选择页 */
    Unbind() {
        this.Confirm('confirm.confirm_return', '', (result) => {
            if (result == 'pass') {
                this._service.deleteModel('admin/WorkBillOperationProcess/', [{ pwb_key: this.record.other_node.key }], (sucess) => {
                    let record = Object.assign({}, this.record, { action: "flowLamin", node: this.record.other_node })
                    this.onReturn.emit(record);
                    this.close();
                })
            }
        })
    }
    RefreshFlow(ev?) {
        if (this.isRefreshFlow == true) {
            this.getList(this.otherUrl?.getFlow, { popm_key: this.node.key, bwi_key: this.node.bwi_key });
        }
    }
}