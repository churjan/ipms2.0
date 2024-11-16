import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, EventEmitter, Injectable, Output, Renderer2, ViewChild } from '@angular/core';
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
    selector: 'flow',
    templateUrl: './comm-flow.component.html',
    styleUrls: ['./comm-flow.component.less']
})
@Injectable({ providedIn: 'root' })
export class CommFlowComponent extends FormTemplateComponent {
    constructor(private http: HttpClient, private _renderer: Renderer2,
        private breakpointObserver: BreakpointObserver,) { super(); }
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
    /****************************款式工序流**********************************/
    newmodel: any = {};
    /**路线图选择 */
    pormType: any = [];
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
    routertype = false;
    /**特殊权限 */
    btnstationset: any = {};
    /**特殊按钮 */
    btnGroup: any
    /**已使用站位 */
    usedstation = new Array();
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
    /**初始化 */
    ngOnInit(): void {
        this.otherUrl = this.modular.otherUrl;
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) { this.width = '800px' } else { this.width = '100%' }
        })
        this._service.getModel('SystemInfo/getoperationprocessconfig', '', (r) => {
            // console.log(r)
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
        // this._service.getModel('SystemInfo/getopenschemeoverload', '', (r) => {
        //     this.isoverload = r == 'true' ? true : false;
        // }, (err) => { this.isoverload = false; })
        // this._service.getModel('SystemInfo/getdistributionmode', '', (r) => {
        //     this.routertype = r
        // })
        this.GetParameters();
        if (localStorage.getItem("stationCache")) {
            let stationCache = JSON.parse(localStorage.getItem("stationCache"));
            this.stationselect = stationCache.key;
            this.getstation('', stationCache)
        }
    }
    /**打开弹窗 */
    async open(record: any) {
        this.title = this._appService.translate("placard." + record.title);
        this.otherUrl = this.modular.otherUrl;
        this.newOP = new Array();
        if (record.UseDiversionScheme) {
            this.btnstationset = record.UseDiversionScheme == 'true' ? true : false;
        } else this.btnstationset = false
        if (record.btnGroup) { this.btnGroup = record.btnGroup }
        if (sessionStorage.bwi_list) {
            let _bwi_list = JSON.parse(sessionStorage.bwi_list);
            if (!this.bwi_list) { this.bwi_list = []; }
            if (_bwi_list) { _bwi_list.forEach(_b => { if (_b && _b != null && _b != undefined) { this.bwi_list.push(_b); } }) }
        }
        if (record) {
            this.node = record.node;
            this.key = record.node.key;
            // this._service.getModel('SystemInfo/getroutecalculation/', '', (result) => { this.routecalculation = result; })
            this.copymodel.psi_key = this.node && this.node.psi_key ? this.node.psi_key : '';
            if (this.default.parts && this.default.parts.length == 0)
                this._service.comList('partinfo', {}, 'getlist').then(sucess => { if (sucess) { this.bpiList = sucess; } });
            this.power = Object.assign(this.power, record.power)
            if (this.power.sversion) this.versionPower = this.power.sversion;
            this.power.type = record.type;
            if (record.type == 'W') { this.workData(); }
            if (record.type == 'S') { this.styleData(); }
        } else {
            this.key = null
        }
        this.visible = true
    }
    /**作业单工序流获取 */
    workData() {
        this.node.opp_type = this.node.opp_type ? this.node.opp_type : parseInt(sessionStorage.opp_type);
        this._service.enumList('OperationProcessTypeEnum').then(result => { this.node.opp_type_name = result.find(v => v.value == this.node.opp_type).description });
        if (!this.node.opp_type || this.node.opp_type == 1) {
            this.node.opp_type = 1;
            this._service.comList('WorkBill/option', { psi_key: this.node.psi_key }).then(sucess => {
                let _data = (sucess instanceof Array) == true ? sucess : sucess.data;
                if (_data) {
                    let n = _data.findIndex(w => w.key == this.node.key);
                    _data.splice(n, 1)
                    this.sameParaWork = _data;
                }
            });
        } else {
            this.power.flowpower = false;
            this.power.wages = false;
            this.power.mappower = false;
            this.power.IsUpdate = false;
        }
        this.getList(this.otherUrl.getFlow, { pwb_key: this.node.key });
    }
    styleData() {
        if (this.node && this.node.key) { this.getMap(); } else {
            this.newmodel = Object.assign({ psorm_key: '', psorm_name: '', psopm_code: '', psopm_name: '', psopm_pci_key: '', psopm_customcode: '', psopm_version: '' }, this.node);
            this.newmodel.psopm_code = UtilService.shortUUID();
            if (this.node.psi_key)
                this.newmodel.psopm_name = this.getTipsMsg('placard.ProcessFlow') + UtilService.shortUUID();
            if (this.power.ispublic) {
                this.newmodel.ispublic = this.power.ispublic;
                this.newmodel.psopm_name = this.getTipsMsg('placard.commflow') + UtilService.shortUUID();
            }
            if (this.default.worksections && this.default.worksections.length > 0) {
                this.default.worksections.forEach((d, i) => {
                    this.sectionAdd(this.section, d)
                    if (this.default.parts && this.default.parts.length > 0 && i == 0) {
                        this.default.parts.forEach(dp => {
                            this.newTab(dp)
                        })
                    }
                })
            }
        }
    }
    /**款式工序流请求 */
    getMap() {
        const that = this;
        let key = that.node.key ? that.node.key : '';
        this._service.getList(this.otherUrl.flow.map, { psopm_key: key }, (Type) => {
            this.pormType = Type;
            let psorm = Type.filter(s => s.isdefault == true);
            if (Type.length == 1 && (!psorm || psorm.length == 0)) { psorm = Type }
            if (psorm && psorm.length > 0) {
                that.newmodel = Object.assign({}, that.newmodel, {
                    psorm_key: psorm[0].key,
                    psorm_name: psorm[0].name,
                    psorm_isdefault: psorm[0].isdefault,
                    psopm_key: key,
                    psopm_version: psorm[0].psopm_version,
                    psopm_pci_key: psorm[0].psopm_pci_key ? psorm[0].psopm_pci_key : '',
                    psopm_customcode: psorm[0].psopm_customcode ? psorm[0].psopm_customcode : ''
                });
                this.getMapFlow({ psopm_key: key, psorm_key: psorm[0].key });
            } else {
                that.getList(this.otherUrl.flow.Styleget, { psopm_key: key });
            }
        });
    }
    /**款式路线图请求 */
    getMapFlow(newmodel) {
        this._service.getPage(this.otherUrl.flow.getmap, newmodel, (result) => {
            let _node = result;
            if (this.CopyProgress == true) {
                _node = Object.assign({}, this.newmodel, { partlist: result.partlist, worksectionlist: result.worksectionlist })
                this.CopyProgress = false;
            } else {
                this.newmodel = Object.assign({}, this.newmodel, result)
            }
            this.HandleData(_node, 'is');
        });
    }
    /**数据获取 */
    getList(url, body) {
        this._service.getPage(url, body, (result) => {
            if (result) {
                let _node: any = result;
                if (this.CopyProgress == false)
                    this.newmodel = Object.assign({}, result);
                else if (this.CopyProgress == true) {
                    _node = Object.assign({}, this.newmodel, { partlist: result.partlist, worksectionlist: result.worksectionlist })
                    this.CopyProgress = false;
                }
                if (_node.partlist.length == 0 && this.default.worksections && this.default.worksections.length > 0) {
                    this.default.worksections.forEach((d, i) => {
                        this.sectionAdd(this.section, d)
                        if (this.default.parts && this.default.parts.length > 0 && i == 0) {
                            this.default.parts.forEach(dp => {
                                this.newTab(dp)
                            })
                        }
                    })
                } else
                    this.HandleData(_node);
            }
        }, (err) => {
            // this.message.error(err)
        });
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
        if (UtilService.isEmpty(this.newmodel.psopm_customcode) == true) {
            this.message.error(this.getTipsMsg('inputdata.input_customcode'))
            return
        }

        this._Price.open({ title: this.getTipsMsg('placard.PricePush'), node: this.newmodel.psopm_customcode })
    }
    /**路线图选择 */
    mapselect(e) {
        if (e) {
            const por = this.pormType.find(po => po.key == e);
            if (por) {
                this.newmodel.psorm_isdefault = por.isdefault;
                this.newmodel.psorm_name = por.name;
                this.getMapFlow({ psopm_key: this.newmodel.psopm_key, psorm_key: por.key });
            }
        }
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
            this.location(this.filteredOptions[nodeindex], nodeindex)
        }
    }
    pointSelect(ev) {
        this.onInput();
    }
    /**添加路线图 */
    addmap() {
        this.newmodel.psorm_key = '';
        this.newmodel.psorm_name = '';
        this.newmodel.psorm_isdefault = false;
        if (this.newFlow && this.newFlow.partlist) {
            this.newFlow.partlist.forEach(jay => {
                jay.isfold = false;
                if (jay.worksectionlist) {
                    jay.worksectionlist.forEach(tro => {
                        if (!tro.detaillist) { tro.detaillist = new Array(); }
                        tro.detaillist.forEach(ble => { ble.routelist = []; ble.helplist = []; });
                        if (!this.newOP) { this.newOP = new Array(); }
                    });
                }
            });
            if (this.section && this.section.length > 0) { this.sectionCheck(this.section.find(x => x.bwi_code == this.nzSelected), 0); } else { this.preview(); }
        }
    }
    /**删除路线图 */
    delmap(key) {
        const that = this;
        if (key) {
            const smap = this.pormType.find(k => k.key == key);
            this.Confirm('confirm.confirm_deln', smap.name, (result) => {
                if (result == 'pass') {
                    that._service.deleteModel(that.otherUrl.flow.map, [smap], (result) => {
                        this.message.success(this.getTipsMsg('sucess.s_delete'));
                        that.newmodel.psorm_key = '';
                        that.newmodel.psorm_name = '';
                        that.getMap();
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
    }
    /**数据重组 */
    HandleData(data, is?) {
        this.newFlow = data;
        this.section = new Array();
        if (data.worksectionlist && data.worksectionlist.length > 0) { this.section = data.worksectionlist; }
        this.bwi_list.forEach(bwi => {
            if (bwi && this.section.find(sec => sec.bwi_key == bwi.key)) { bwi.hidd = true; } else { bwi.hidd = false; }
        });
        if (this.newFlow.partlist && this.newFlow.partlist.length > 0) {
            this.newFlow.partlist.forEach((x, fpnum) => {
                if (this.node.isdefault == true && this.node.psorm_key) { x.isfold = false; } else {
                    if (is && (!x.isfold || x.isfold == null)) { x.isfold = false; } else if (!x.isfold || x.isfold == null) {
                        if (this.power.type == 'W') { x.isfold = false; } else { x.isfold = true; }
                    }
                }
                x.bpi_sort = x.bpi_sort ? x.bpi_sort : fpnum;
                if (x.worksectionlist) {
                    if (this.section && this.section.length > 0) {
                        this.sectionCheck(this.section[0], 0);
                    } else { this.preview(); }
                }
            });
            this.newFlow.partlist[this.selectedIndex].worksectionlist.forEach(pw => {
                this.flowopall.push(...pw.detaillist)
                this.flowopall = UtilService.uniq(this.flowopall)
            })
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
        let top = this.Anchornum < hash.length - 1 ? hash[this.Anchornum].offsetTop : hash[0].offsetTop;
        let name = this.newFlow.partlist[this.selectedIndex].bpi_name;
        $("nz-list[id='" + name + "']").animate({ scrollTop: top }, 500);
    }
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
    /**工段新增 */
    sectionAdd(section, seckey) {
        if (seckey.name == this.tipsMsg.nodatas) { return; }
        if (!seckey || seckey == '') {
            this.message.warning(this.getTipsMsg('checkdata.check_seckey'))
            return;
        }
        if (section.filter(sn => sn.bwi_key == seckey.key).length >= 2) {
            this.message.warning(this.getTipsMsg('warning.section'))
            return;
        }
        let sec = { bwi_key: seckey.key, bwi_name: seckey.name, bwi_code: seckey.code };
        section.push(sec);
        seckey.hidd = true;
        if (!this.bwi_list.find(zh => !zh.hidd || zh.hidd == false)) { this.bwi_list.push({ hidd: false, name: this.tipsMsg.nodatas }); }
        this.sectionCheck(sec, section.length - 1);
    }
    /**工段删除 */
    sectionClose(section, i) {
        const that = this;
        let seckey = section[i].bwi_key;
        // if (this.newFlow.partlist.length > 0) {
        //     let _newOP = this.newOP[this.newFlow.partlist[this.selectedIndex].bpi_name]
        //     if (_newOP && _newOP.length <= 0) { section[i].disabled = true; return }
        // }
        if (!seckey || seckey == '') { section.splice(i, 1); return; }
        if (!this.bwi_list.find(b => b.key == seckey)) {
            this.message.error(this.getTipsMsg('warning.nodelJurisdiction'))
            return;
        }
        this.Confirm('confirm.confirm_deln', section[i].bwi_name, (ev) => {
            if (ev == 'pass') {
                section.splice(i, 1);
                that.bwi_list.forEach(yu => {
                    if (!yu.key) { yu.hidd = true; }
                    if (yu.key == seckey) { yu.hidd = false; }
                });
                if (i - 1 >= 0 || section.length == 0) { this.preview(); } else { that.sectionCheck(section[i - 1], i - 1); }
                that.newFlow.partlist.forEach(n => {
                    n.worksectionlist = n.worksectionlist.filter(w => w.bwi_key != seckey)
                    // n.worksectionlist.forEach((w, j) => { if (w.bwi_key == seckey) { n.worksectionlist.splice(j, 1); } });
                });
                this.sectionCheck(this.section[0], 0);
            }
        });
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
        this.power.issdiction = this.Jurisdiction(this.section[num]);
        if (!this.newFlow.partlist || this.newFlow.partlist === null) { this.newFlow.partlist = []; }
        // this.options = new Array();
        this.newFlow.partlist.forEach((part, pi) => {
            const b = part.worksectionlist.find(x => x.bwi_key === seckey.bwi_key);
            if (!b) {
                let _b = Object.assign({}, seckey, { bwi_sort: num, detaillist: [] })
                part.worksectionlist.push(_b);
                this.newOP[part.bpi_name] = _b.detaillist;
            } else {
                if (!b.detaillist || b.detaillist === null) { b.detaillist = []; }
                if (pi == this.selectedIndex && seckey.bwi_key == b.bwi_key) {
                    this.options = new Array();
                    this.StationAggregation = new Array();
                }
                b.detaillist.forEach((p, di) => {
                    if (pi == this.selectedIndex && seckey.bwi_key == b.bwi_key) {
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
                                        title: dr.bls_name + '-' + dr.bls_code,
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
                        if (p.overloadlist)
                            p.overloadlist.forEach(po => {
                                this.usedstation.push({ key: po.station_key, code: po.station_code });
                            })
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
                this.newOP[part.bpi_name] = b.detaillist;
            }
        });
        this.isused();
        this.selectoeder = {}
    }
    /**预览 */
    preview() {
        const that = this;
        this.nzSelected = '';
        this.usedstation = new Array();
        this.newFlow.partlist.forEach((part, pi) => {
            if (!part || part === null) { return; }
            if (part.worksectionlist) {
                that.newOP[part.bpi_name] = [];
                that.options = new Array();
                that.StationAggregation = new Array();
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
                                    de.overloadlist.forEach(po => {
                                        this.usedstation.push({ key: po.station_key, code: po.station_code });
                                    })
                                that.newOP[part.bpi_name].push(de);
                                if (!that.divider.find(d => d == element.bwi_name)) {
                                    that.divider.push(element.bwi_name);
                                } else { that.divider.push(''); }
                            });
                        }
                    }
                });
            }
        });
        this.isused();
    }
    /**部件选择 */
    partSelect() {
        this.newFlow.partlist.map(n => {
            if (!this.newOP[n.bpi_name]) this.newOP[n.bpi_name] = new Array();
            this.newOP[n.bpi_name].forEach(d => { d.checked = false; });
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
        let show = par.worksectionlist.find(x => x.bwi_code == this.nzSelected);
        let pwd = show ? show.detaillist : par.worksectionlist[0].detaillist;
        this.newOP[par.bpi_name].forEach(d => { d.checked = false; });
        pwd.forEach(d => { d.checked = false; });
        if (this.power.mappower == true && this.routecalculation == "1") {
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
        if (type && type != null) {
            if (type == 'workop') {
                this.message.error(this.getTipsMsg('checkdata.check_Workfow'))
                this.CopyProgress = false;
                return;
            }
            m.old_key = type.key;
            b.pwb_key = type.key;
            if (!this.newFlow.pwb_key) { this.newFlow.pwb_key = this.model.key; }
            m.key = this.newFlow.pwb_key;
            this.getList(this.otherUrl.getFlow, b);
        } else {
            if (!this.copymodel.psopm_key) {
                this.message.error(this.getTipsMsg('checkdata.check_Styleflow'))
                this.CopyProgress = false;
                return;
            }
            b.psopm_key = this.copymodel.psopm_key;
            b.psorm_key = this.copymodel.psorm_key;
            if (UtilService.isNotEmpty(this.copymodel.psorm_key) == true) {
                // this.newmodel.psorm_key = b.key;
                this.newmodel.psorm_name = b.name;
                // this.newmodel.psorm_isdefault = b.psorm_isdefault;
                this.getMapFlow(b);
            } else {
                this.getList(this.otherUrl.flow.Styleget, b);
            }
        }
        this.copymodel = {};
        this.copymodel.psi_key = this.node && this.node.psi_key ? this.node.psi_key : '';
    }
    /**添加部件 */
    newTab(node) {
        this.searchPart = Object.assign({}, node);
        let sec = this.section.find(s => s.bwi_code == this.nzSelected);
        let sort = this.section.findIndex(s => s.bwi_code == this.nzSelected);
        if (!this.searchPart || this.searchPart && (!this.searchPart.key || this.searchPart.key == '')) {
            this.message.error(this.getTipsMsg('checkdata.check_part'));
            return;
        }
        if (!this.newFlow.partlist || this.newFlow.partlist === null) { this.newFlow.partlist = []; }
        const spart = this.newFlow.partlist.find(x => x.bpi_key == this.searchPart.key);
        if (spart) {
            this.message.error(this.getTipsMsg('msgdata.addfail_part'));
            return;
        }
        let bpi_ismain = this.newFlow.partlist.find(x => x.bpi_ismain == true);
        if (bpi_ismain && this.searchPart.ismain == true) {
            this.searchPart.ismain = false;
        }
        if (!sec || sec.bwi_key == '') {
            this.message.error(this.getTipsMsg('checkdata.check_seckey'));
            return;
        }
        let worksectionlist = [{ bwi_key: sec.bwi_key, bwi_code: sec.bwi_code, bwi_sort: sort, detaillist: [] }];
        let data = {
            bpi_ismain: this.searchPart.ismain ? this.searchPart.ismain : false,
            bpi_key: this.searchPart.key,
            bpi_name: this.searchPart.name,
            bpi_class_name: this.searchPart.class_name,
            bpi_class_code: this.searchPart.class_code,
            bpi_sort: this.newFlow.partlist.length + 1,
            worksectionlist: worksectionlist, checked: false, isfold: false
        };
        this.newOP[this.searchPart.name] = new Array();
        this.nzSelected = this.section[0].bwi_code;
        this.newFlow.partlist.push(data);
        this.doneto = this.searchPart.name;
        this.searchPart = {};
        this.selectedIndex = this.newFlow.partlist.length - 1;
        // console.log(this.newFlow, this.selectedIndex)
        this.flowopall = new Array();
    }
    /**删除部件 */
    closeTab({ index }: { index: number }) {
        this.newFlow.partlist.splice(index, 1);
    }
    /**主部件设置 */
    mainselect(par, ev) {
        if (this.power.IsUpdate != true || this.nzSelected == '') { return; }
        let _ismain = par.bpi_ismain;
        this.Confirm(_ismain != true ? 'confirm.confirm_bpimagin' : 'confirm.confirm_cancelbpimagin', '', (ev) => {
            if (ev == 'pass') {
                // par.bpi_ismain = !_ismain;
                // if (par.bpi_ismain == true)
                this.newFlow.partlist.forEach(newp => { newp.bpi_ismain = par.bpi_key == newp.bpi_key ? !_ismain : false; });
            } else {
                par.bpi_ismain = _ismain;
            }
        });
    }
    /**一键折叠 */
    Fold(par, i) {
        par.isfold = !par.isfold;
        this.newOP[par.bpi_name].forEach(nf => nf.checked = false)
    }
    /**一键清空路线图 */
    del_map(par) {
        this.Confirm('confirm.confirm_clean', '', (ev) => {
            if (ev == 'pass') {
                par.worksectionlist.forEach(element => {
                    element.detaillist.forEach(detail => { detail.routelist = []; })
                });
                this.message.success(this.getTipsMsg('sucess.s_clean'));
            }
        })
    }
    /**参数调整*/
    parameter(type, option, i, event, bpi_name) {
        event.stopPropagation()
        const that = this;
        let parmodel = { part: option, originalsort: i, bpi_name: bpi_name };
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
                this.setvisible[bpi_name + i] = false;
                break;
            /**点击调整详情参数 */
            case 'Information':
                that.param.production_time = option[i].production_time;
                that.param.production_wages = option[i].production_wages;
                that.param.operation_requrement = option[i].operation_requrement;
                that.param.qc_requrement = option[i].qc_requrement;
                that.param.Information = parmodel;
                that.setvisible[bpi_name + parmodel.originalsort] = false;
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
                    this.setvisible[param.bpi_name + param.originalsort] = false;
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
                this.setvisible[param.bpi_name + param.originalsort] = false;
                break;
        }
    }
    /**删除 */
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
                let fi = this.flowopall.findIndex(f => f.poi_name == ordermodel.poi_name);
                if (fi >= 0) this.selectoeder = {};
                part.splice(i, 1);
                let opi = that.options.findIndex(o => o.name == sname && o.sort == i + 1);
                if (opi >= 0) { that.options.splice(opi, 1); }
                if (!par && part.length > i) { that.doneto = part[this.selectedIndex].bpi_name; }
                this.flowopall = new Array();
                this.newFlow.partlist[this.selectedIndex].worksectionlist.forEach(pw => {
                    this.flowopall.push(...pw.detaillist)
                    this.flowopall = UtilService.uniq(this.flowopall)
                })
                let total = 0;
                total = part.reduce(function (total, currentValue, currentIndex, arr) {
                    return currentValue.percentage ? (total + currentValue.percentage) : total;
                }, 0);
                part.map((v) => { v.percent = total > 0 ? ((v.percentage / total) * 100).toFixed(2) + '%' : '0%'; })
                this.isused();
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
            }
        })
    }
    /**上下调整 */
    bpimove(num: number, option, i) {
        const ordermodel = option[i];
        option.splice(i, 1);
        option.splice(i + num, 0, ordermodel);
        option.forEach((md, s) => { md.sort = s; });
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
        if (event.item.dropContainer.id == "stodoList") { this.Disabled = true; }
    }
    curIndex: number = 0;
    getIndex(OPlist, index: number) {
        // this.curIndex = index;
        // let container: any = OPlist[index];
        // this.lockAxis = true;
        // if (this.Disabled == true) {
        //     let par = this.newFlow.partlist[this.selectedIndex];
        //     if ( OPlist[index].show == true) {
        //         return
        //     }
        //     par.isfold = false;
        //     OPlist.forEach(nc => {
        //         nc.checked = false;
        //         nc.show = OPlist[index].poi_key == nc.poi_key ? !nc.show : false;
        //     });
        //     OPlist[index].checked = true;
        // }

    }
    dragStart(event) {
        this.cloned = document.getElementsByClassName("cdk-drag-preview")[0];
    }
    /**指针经过 */
    dragMoved(e, action) {
        let container: any = e.container.data;
        this.lockAxis = true;
        // if (container.length - 1 == e.currentIndex) this.lockAxis = true; else this.lockAxis = false;
        if (this.Disabled == true) {
            // this.Disabled = true;
            if (e.currentIndex > container.length) { return }
            let currentIndex = e.currentIndex < 0 ? 0 : (e.currentIndex <= container.length ? e.currentIndex : container.length - 1);
            // let currentIndex = this.curIndex;
            let par = this.newFlow.partlist[this.selectedIndex];
            let OP = container[currentIndex] ? container[currentIndex] : container[currentIndex - 1];
            if (OP.show == true) {
                return
            }
            par.isfold = false;
            container.forEach(nc => {
                nc.checked = false;
                nc.show = OP.poi_key == nc.poi_key ? !nc.show : false;
            });
            OP.checked = true;
            this._renderer.addClass(this.cloned, "nodisplay");
        }
        // this._renderer.removeClass(this.cloned, "red");
        // this._renderer.removeClass(this.cloned, "green");

        // const distance: { x: number, y: number } = e.distance;
    }
    cloned: any;
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
        oplist[i].routelist = new Array();
        oplist[i].routelist = oplist[i].routelist.concat(oplist[i - 1].routelist);
        oplist[i].routelist.forEach(rl => rl = Object.assign(rl, { poi_key: oplist[i].poi_key, poi_name: oplist[i].poi_name, poi_code: oplist[i].poi_code }))
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
        if (this.power.issdiction == false) {
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
            // if (par && par.worksectionlist[this.power.show]) {
            //     if (!par.worksectionlist[this.power.show].detaillist) { par.worksectionlist[this.power.show].detaillist = []; }
            //     par.worksectionlist[this.power.show].detaillist = list;
            // }
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
            if (event.previousContainer.id == "stodoList") {
                //站位
                let contdata = container[event.currentIndex || event.currentIndex < container.length ? event.currentIndex : event.currentIndex - 1];
                if (!contdata) {
                    that.message.error(that.getTipsMsg('warning.noaddprocess'));
                    this.lockAxis = false;
                    return;
                }
                if (this.isoverload == true) {
                    if ($('#overload').offset() && event.dropPoint.x > $('#overload').offset().left) {
                        contdata = container[event.currentIndex];
                        if (contdata['routelist'].length == 0) {
                            that.message.error(this.getTipsMsg('warning.PlaseAddStation'));
                            this.lockAxis = false;
                            return;
                        }
                        let overload: any = {
                            psopm_key: this.newmodel.psopm_key ? this.newmodel.psopm_key : this.node.key,
                            psi_key: this.node.psi_key,
                            poi_key: contdata.poi_key,
                            station_key: data.key,
                            station_code: data.code,
                            station_name: data.name,
                            pkey_code: data.pkey_code,
                        }
                        let currentsonIndex = contdata['overloadlist'] ? contdata['overloadlist'].length : 0;
                        if (!contdata['overloadlist'] || contdata['overloadlist'] == null) { contdata['overloadlist'] = []; }
                        let t: boolean;
                        list.forEach((l) => {
                            if (l.routelist.find(s => s.bls_key == data.key)) {
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
                                        that.StationAggregation = that.StationAggregation.filter(s => s.code != data.code);
                                        this.usedstation.push({ key: overload.station_key, code: overload.station_code });
                                        this.usedstation = UtilService.uniq(this.usedstation)
                                        list.forEach((l) => {
                                            if (!l.routelist) { l.routelist = [] }
                                            l.routelist = l.routelist.filter(s => s.bls_key != overload.station_key);
                                            l.overloadlist = l.overloadlist.filter(s => s.station_key != overload.station_key);
                                        })
                                        transferArrayItem([overload], contdata['overloadlist'], 0, this.curIndex);
                                    });
                                }
                            });
                        } else {
                            this._service.saveModel('admin/schemeoverload/', 'post', overload, (r) => {
                                overload = Object.assign(overload, r)
                                this.usedstation.push({ key: overload.station_key, code: overload.station_code });
                                this.usedstation = UtilService.uniq(this.usedstation)
                                this.message.success(this.getTipsMsg('sucess.s_update'));
                                transferArrayItem([overload], contdata['overloadlist'], 0, this.curIndex);
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
                                                that.StationAggregation = that.StationAggregation.filter(s => s.code != data.code);
                                                list.forEach((l) => {
                                                    if (!l.routelist) { l.routelist = [] }
                                                    l.routelist = l.routelist.filter(s => s.bls_key != overload.station_key);
                                                    l.overloadlist = l.overloadlist.filter(s => s.station_key != overload.station_key);
                                                })
                                                transferArrayItem([overload], contdata['overloadlist'], 0, this.curIndex);
                                            });
                                        }
                                    });
                                }
                            })
                        }
                    } else {
                        this._service.comList('SchemeOverload/Extend/IsOverload', { Station_Key: data.key }).then(v => {
                            this.dropadd(data, event, container, contdata)
                        })
                    }
                } else {
                    this.dropadd(data, event, container, contdata);
                }
                this.Disabled = false;
                this.isused();
            } else { // 全工段工序判重
                par.worksectionlist.forEach(wor => {
                    if (wor.detaillist && wor.detaillist.length > 0) {
                        for (let i of wor.detaillist) {
                            if (data.key === i.poi_key && data.style == 1000) {
                                isrepeat = true;
                                if (!wor.bwi_name || wor.bwi_name == '') {
                                    let _section = that.section.find(se => se.bwi_key == wor.bwi_key);
                                    if (_section) { wor.bwi_name = _section.bwi_name; }
                                }
                                that.message.error(that.getTipsMsg('warning.Processexistence') + wor.bwi_name);
                                this.lockAxis = false;
                                return;
                            }
                        }
                    }
                })
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
                    helplist: [],
                    checked: true,
                    optyle: smodel,
                    sort: event.currentIndex
                }
                let drge = [opmodel];
                let show = par.worksectionlist.find(x => x.bwi_code == this.nzSelected);
                if (!show.detaillist) { show.detaillist = [] }
                show.detaillist = list;
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
            }
        }
        this.lockAxis = false;
        // return;
    }
    /**拖拽站位添加 */
    dropadd(data, event, container, contdata) {
        if (!data.mixtureratio || data.mixtureratio === null) {
            data.mixtureratio = 0;
        }
        if (UtilService.isNotEmpty(data.mixtureratio) || data.mixtureratio == 0) {
            if (data.mixtureratio < 0) {
                this.message.error(this.getTipsMsg('warning.vrs'));
                this.lockAxis = false;
                return;
            }
            let stationdrags = {
                bls_key: data.key,
                percentage: data.mixtureratio,
                bls_code: data.code,
                bls_name: data.name,
                pkey_code: data.pkey_code,
                checked: false,
                percent: '100%'
            };
            if (event.currentIndex > container.length) { this.lockAxis = false; return };
            let containerson = contdata['routelist'];
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
            let currentsonIndex = containerson ? containerson.length : 0;
            transferArrayItem([stationdrags], containerson, 0, currentsonIndex);
            this.Disabled = false
            let tq = this.StationAggregation.findIndex(sa => sa.code == stationdrags.bls_code)
            if (tq >= 0) {
                this.StationAggregation[tq].poi_list.push({
                    poi_code: data.poi_code,
                    poi_sort: data + 1,
                    sort: (data.routelist ? data.routelist.length : 0) + 1,
                })
            } else {
                let _routes: any = {
                    title: stationdrags.bls_name + '-' + stationdrags.bls_code,
                    name: stationdrags.bls_name,
                    code: stationdrags.bls_code,
                    poi_list: [{
                        poi_code: data.poi_code,
                        poi_sort: data.sort + 1,
                        sort: (data.routelist ? data.routelist.length : 0) + 1,
                    }],
                    setstation: stationdrags.bls_code
                }
                this.StationAggregation.push(_routes);
                this.usedstation.push({ key: stationdrags.bls_key, code: stationdrags.bls_code, });
            }
        }
    }
    /**工序添加 */
    opAdd(ev) {
        if (this.isDrop('todoList') == false) { return }
        /**是否重复 */
        let isrepeat: boolean;
        let par = this.newFlow.partlist[this.selectedIndex]
        const smodel = this.opParameter.optyle.find(x => x.value === ev.style);
        // console.log(this.newFlow.partlist, this.selectedIndex)
        par.worksectionlist.forEach(wor => {
            if (wor.detaillist && wor.detaillist.length > 0) {
                for (let i of wor.detaillist) {
                    if (ev.key === i.poi_key && ev.style == 1000) {
                        isrepeat = true;
                        if (!wor.bwi_name || wor.bwi_name == '') {
                            let _section = this.section.find(se => se.bwi_key == wor.bwi_key);
                            if (_section) { wor.bwi_name = _section.bwi_name; }
                        }
                        this.message.error(this.getTipsMsg('warning.Processexistence') + wor.bwi_name);
                        this.lockAxis = false;
                        return;
                    }
                }
            }
        })
        if (isrepeat == true) { this.lockAxis = false; return; }
        // if (this.newOP[par.bpi_name].find(l => ev.key === l.poi_key) && ev.style == 1000) {
        //     let wor = this.section.find(ss => ss.bwi_code == this.nzSelected)
        //     this.message.error(this.getTipsMsg('warning.Processexistence') + wor.bwi_name);
        //     return;
        // }
        let sort = this.newOP[par.bpi_name].findIndex(ns => ns.checked == true)
        if (sort < 0) { sort = this.newOP[par.bpi_name].length - 1 }
        this.newOP[par.bpi_name].splice(sort + 1, 0, {
            poi_key: ev.key,
            poi_name: ev.name,
            poi_code: ev.code,
            poi_style: ev.style,
            production_time: ev.standard_time,
            production_wages: ev.standard_wages,
            operation_requrement: ev.requrement,
            qc_requrement: ev.qc_requrement,
            routelist: [],
            helplist: [],
            checked: true,
            optyle: smodel,
            sort: sort + 1
        })
        this.newOP[par.bpi_name].forEach(lc => {
            lc.checked = ev.key == lc.poi_key ? true : false;
            if (ev.key == lc.poi_key)
                this.selectoeder = lc;
        })
        let show = par.worksectionlist.find(x => x.bwi_code == this.nzSelected);
        if (!show.detaillist) { show.detaillist = [] }
        show.detaillist = this.newOP[par.bpi_name];
        let _options: any = {
            title: ev.name + '-' + ev.code,
            name: ev.name, code: ev.code,
            sort: sort + 1
        }
        if (ev.pyso_operationticket) { _options.pyso_operationticket = ev.pyso_operationticket; }
        this.options.push(_options);
        this.flowopall.push({
            poi_key: ev.key,
            poi_name: ev.name,
            poi_code: ev.code,
            poi_style: ev.style,
            production_time: ev.standard_time,
            production_wages: ev.standard_wages,
            operation_requrement: ev.requrement,
            qc_requrement: ev.qc_requrement,
            routelist: [],
            helplist: [],
            checked: true,
            optyle: smodel,
            sort: sort + 1
        })
        this.flowopall = UtilService.uniq(this.flowopall)
    }
    /**站位添加 */
    Add(data) {
        let drge: any = {};
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
                psopm_key: this.newmodel.psopm_key ? this.newmodel.psopm_key : this.node.key,
                pkey_code: data.pkey_code,
                checked: false,
                iscover: false,
                psi_key: this.node.psi_key,
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
            let bpi_name = this.newFlow.partlist[this.selectedIndex].bpi_name;
            let i = this.newOP[bpi_name].findIndex(nb => nb.poi_key == this.selectoeder.poi_key);
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
                            // this.newOP[bpi_name][i]=this.selectoeder;
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
                                    // this.newOP[bpi_name][i]=this.selectoeder;
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
    }
    /**工序流平衡 */
    balance() {
        let partlist = new Array();
        this.newFlow.partlist.forEach(item => {
            let station = new Array();
            let oplist = new Array();
            item.worksectionlist.forEach(w => {
                if (w.detaillist) {
                    w.detaillist.forEach(d => {
                        let o = Object.assign({}, { name: d.poi_name, code: d.poi_code, time: d.production_time, station: [] })
                        if (d.routelist) {
                            d.routelist.forEach(r => {
                                let Streamline = { poi_name: d.poi_name, poi_code: d.poi_code, time: (d.production_time / d.routelist.length) * r.percentage, percentage: r.percentage }
                                let s = station.find(s => s.code == r.bls_code);
                                if (!s) {
                                    let body = Object.assign({}, { code: r.bls_code }, { oplist: [Streamline] })
                                    station.push(body);
                                } else {
                                    s.oplist.push(Streamline);
                                }
                                o.station.push({ code: r.bls_code, percentage: r.percentage })
                            });
                        }
                        oplist.push(o)
                    });
                }
            });
            partlist.push({ bpi_name: item.bpi_name, station: station, oplist: oplist });
        });
        if (partlist.length > 0)
            this._Balance.open({ title: 'placard.balance', node: partlist })
    }
    /**站位规则设置 */
    stationset() {
        this._stationSet.open({ title: 'placard.stationset', node: this.newmodel })
    }
    impflow() {
        this._imp.open({ title: 'import', node: { key: this.node.key } })
    }
    /**下载报表 */
    Expflow() {
        let params: any = {};
        if (!this.node.key) { return; }
        if (this.power.type == 'W') {
            params = Object.assign({}, { pwb_key: this.node.key });
        }
        if (this.power.type == 'S') {
            params = Object.assign({}, {
                psopm_key: this.newmodel.psopm_key ? this.newmodel.psopm_key : '',
                psorm_key: this.newmodel.psorm_key ? this.newmodel.psorm_key : ''
            });
        }
        const nowdate = this.getTipsMsg('btn.flowexport') + UtilService.dateFormat(new Date(), 'yyyy-MM-dd') + '.xls';
        const downloadUrl = environment.baseUrl + '/' + this.otherUrl.flowexpurl;
        this._httpservice.download(downloadUrl, nowdate, params);
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
            let s = 0;
            that.section.forEach((element, i) => {
                let sec = par.worksectionlist.find(w => w.bwi_key == element.bwi_key);
                if (sec) {
                    sec.bwi_sort = i;
                    sec.detaillist.forEach((de, l) => { s = s + 1; de.sort = s; });
                }
            });
        });
        if (this.power.type == 'W') {
            this.newFlow.pwb_key = this.node.key;
            super.save({ model: this.newFlow, url: this.otherUrl.flow.save, isClose: false, doAction: 'post' }, () => {
                this.submiting = false;
            }, false)
        }
        if (this.power.type == 'S') {
            let is: boolean;
            if (!this.newmodel.psopm_code || this.newmodel.psopm_code == '') {
                this.message.error(this.getTipsMsg('inputdata.input_flowcode'));
                this.submiting = false;
                return;
            }
            if (!this.newmodel.psopm_name || this.newmodel.psopm_name == '') {
                this.message.error(this.getTipsMsg('inputdata.input_flowname'));
                this.submiting = false;
                return;
            }
            this.newmodel = Object.assign(this.newmodel, { partlist: this.newFlow.partlist });
            if (UtilService.isNotEmpty(that.newmodel.psorm_key) || UtilService.isNotEmpty(that.newmodel.psorm_name)) is = true;
            // this.newFlow.partlist.forEach(f => {
            //     f.worksectionlist.forEach(w => {
            //         let isrouter = w.detaillist.find(p => p.routelist && p.routelist.length > 0);
            //         if (isrouter) { is = true; return; }
            //     });
            // });
            if (is == true && this.routecalculation == "1") {
                this.newmodel.key = '';
                if (UtilService.isEmpty(this.newmodel.psorm_name) == true || UtilService.isEmpty(this.newmodel.psorm_name) == true) {
                    this.message.error(this.getTipsMsg('inputdata.input_selectmap'));
                    this.submiting = false;
                    return;
                }
                if (!this.newmodel.psopm_key && this.node && this.node.key) { this.newmodel.psopm_key = this.node.key; }
                super.save({ url: this.otherUrl.flow.savemap, model: this.newmodel, doAction: 'post' }, (result) => {
                    if (result) {
                        that.newmodel.key = result.psopm_key;
                        that.newmodel.psopm_key = result.psopm_key;
                        that.newmodel.psorm_key = result.psorm_key;
                    }
                    this._service.getList(this.otherUrl.flow.map, { psopm_key: result.psopm_key }, (Type) => {
                        that.pormType = Type;
                    });
                }, false);
            } else {
                super.save({ model: this.newmodel, url: this.otherUrl.flow.save, doAction: 'post' }, (v) => {
                    if (v) {
                        that.newmodel.key = v.psopm_key;
                        that.newmodel.psopm_key = v.psopm_key;
                        this.submiting = false;
                    }
                    this.GetModel();
                }, false)
            }
        }
    }
    /**关闭 */
    close(): void {
        this.avatar = null
        this.visible = false;
        this.newFlow = new Array();
        this.newmodel = {};
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
        this.editDone.emit(true);
    }

}