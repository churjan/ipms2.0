import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, EventEmitter, Injectable, Output, ViewChild } from '@angular/core';
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
    selector: 'flow-new',
    templateUrl: './comm-flow-new.component.html',
    styleUrls: ['./comm-flow-new.component.less']
})
@Injectable({ providedIn: 'root' })
export class CommFlowNewComponent extends FormTemplateComponent {
    constructor(private http: HttpClient,
        private breakpointObserver: BreakpointObserver,) {
        super();
        this.modularInit("commFlow");
    }
    /**系统主题(跟随系统) */
    theme: string = localStorage.theme
    /**平衡 */
    @ViewChild('Balance', { static: false }) _Balance: WorkBalanceComponent;
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
    /**首次进入 */
    firstIn: boolean = false;
    /**作业单关联列表 */
    dataSet = new Array();
    isVisible: boolean = false;
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
    /**退出返回 */
    @Output() onOut = new EventEmitter();
    /**初始化 */
    ngOnInit(): void {
        this.otherUrl = this.modular.otherUrl;
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) { this.width = '800px' } else { this.width = '100%' }
        })
        this.GetParameters();
        if (localStorage.getItem("stationCache")) {
            let stationCache = JSON.parse(localStorage.getItem("stationCache"));
            this.stationselect = stationCache.key;
            this.getstation('', stationCache)
        }
    }
    backups: any = {}
    /**打开弹窗 */
    async open(record: any) {
        // console.log(record)
        this.title = this._appService.translate("placard." + record.title);
        this.backups = record;
        this.otherUrl = this.modular.otherUrl;
        this.newOP = new Array();
        this.firstIn = true;
        this.CopyProgress = record.ischeck
        if (sessionStorage.bwi_list) {
            let _bwi_list = JSON.parse(sessionStorage.bwi_list);
            if (!this.bwi_list) { this.bwi_list = []; }
            if (_bwi_list) { _bwi_list.forEach(_b => { if (_b && _b != null && _b != undefined) { this.bwi_list.push(_b); } }) }
        }
        this._service.getModel('SystemInfo/getroutecalculation/', '', (result) => { this.routecalculation = result; })
        this._service.comList('partinfo', {}).then(sucess => { if (sucess) { this.bpiList = sucess.data; } });
        if (record) {
            this.node = record.node;
            this.key = record.node.key;
            if (this.key) {
                this.isVisible = true;
                this._service.comList('OperationProcessMaster/Extend/UsingWorkbill', { key: this.key }).then(v => {
                    this.dataSet = v;
                })
            }
            this.copymodel.psi_key = this.node && this.node.psi_key ? this.node.psi_key : '';
            this.power = Object.assign(this.power, record.power)
            if (this.power.sversion) this.versionPower = this.power.sversion;
            this.power.type = record.type;
            if (record.type == 'W') { this.workData(); }
            if (record.type == 'S') { this.styleData(); }
        } else {
            this.key = null;
        }
        this.visible = true
    }
    /**返回引导页 */
    outflow() {
        let node = Object.assign(this.backups.node, { key: this.backups.node.pwb_key, flowstate: false })
        this.backups = Object.assign(this.backups, { action: "Back" }, { node: node })
        if (this.onOut) this.onOut.emit(this.backups)
        this.close();
    }
    /**作业单工序流获取 */
    workData() {
        this._service.comList('WorkBillOperationProcess/option', { psi_key: this.node.psi_key }).then(sucess => {
            // console.log(sucess)
            let _data = (sucess instanceof Array) == true ? sucess : sucess.data;
            if (_data) {
                // console.log(this.node)
                // let n = _data.findIndex(w => w.key == this.node.key);
                // _data.splice(n, 1)
                this.sameParaWork = _data;
            }
        });
        this.styleData();
    }
    styleData() {
        if (this.node && this.node.key) { this.getList(this.otherUrl.OperationGet, this.node.key); } else {
            this.newmodel = Object.assign({ name: '', pci_key: '', customcode: '', version: '' }, this.node);
            this.power.IsUpdate = true;
            if (this.node.psi_key)
                this.newmodel.name = this.getTipsMsg('placard.ProcessFlow') + UtilService.shortUUID();
            if (this.power.ispublic) {
                this.newmodel.ispublic = this.power.ispublic;
                this.newmodel.name = this.getTipsMsg('placard.commflow') + UtilService.shortUUID();
            }
        }
    }
    /**数据获取 */
    getList(url, body) {
        this._service.getModel(url, body, (result) => {
            if (result) {
                let _node: any = result;
                // if (this.CopyProgress == false) {
                this.newmodel = Object.assign({}, result);
                this.node.name = this.newmodel.name;
                // } else if (this.CopyProgress == true) {
                //     _node = Object.assign({}, this.newmodel, { partlist: result.partlist, worksectionlist: result.worksectionlist })
                //     this.CopyProgress = false;
                // }
                if (this.firstIn == true && _node.partlist.length == 0) { this.power.IsUpdate = true; this.firstIn = false; }
                this.HandleData(_node);
            }
        }, (err) => { });
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
    /**参数获取 */
    async GetParameters() {
        var source = forkJoin(
            this._service.enumList('operationenum'),
            this._service.enumList('partclass'),
            this._service.comList('WorkSectionInfo/Extend', {}, 'GetMyWorkSectionInfo/')
        ).toPromise<[any, any, any]>().then((data) => {
            data.map((v, i) => {
                switch (i) {
                    case 0:
                        if (!v) { v = []; }
                        this.opParameter.optyle = v.filter(ty => ty.value != 1000);
                        break;
                    case 1: this.bpitype = v; break;
                    case 2:
                        this.bwi_list = this.bwi_list.concat(v);
                        break;
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
            if ((that.list_station.length >= 2 && (that.list_station[0].blst_key == '101010' || ev.group == 'In')) || (that.list_station[0].blst_key != '101010'||ev.group!='In')) {
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
                if (this.section.length <= 0)
                    this.preview();
                else
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
                        if (p.routelist)
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
                                }
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
        this.selectoeder = {}
    }
    /**预览 */
    preview() {
        const that = this;
        this.nzSelected = '';
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
                                    }
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
    CopyOp(type?, url = this.otherUrl.OperationGet) {
        this._service.getModel(url, this.copymodel.popm_key, (result) => {
            if (result) {
                let _node: any = result;
                if (this.power.type == 'S' && this.node.psi_key == this.copymodel.psi_key)
                    this.newmodel = Object.assign({}, result);
                else {
                    _node = Object.assign({}, this.newmodel, { partlist: result.partlist, worksectionlist: result.worksectionlist })
                }
                this.HandleData(_node);
            }
        }, (err) => { });
        this.copymodel = {};
        this.copymodel.psi_key = this.node && this.node.psi_key ? this.node.psi_key : '';
        this.popoverVisible = false;
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
        let worksectionlist = [{ bwi_key: sec.bwi_key, bwi_code: sec.bwi_code, bwi_name: sec.bwi_name, bwi_sort: sort, detaillist: [] }];
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
        this.selectedIndex = this.newFlow.partlist.length;
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
            }
        });
    }
    /**上下调整 */
    bpimove(num: number, option, i) {
        const ordermodel = option[i];
        option.splice(i, 1);
        option.splice(i + num, 0, ordermodel);
        option.forEach((md, s) => { md.sort = s; });
    }
    /**站位禁用 */
    outof(pr, OP, ev) {
        ev.stopPropagation()
        pr.percentage = 0;
        let total = 0;
        total = OP.reduce(function (total, currentValue, currentIndex, arr) {
            return currentValue.percentage ? (total + currentValue.percentage) : total;
        }, 0);
        OP.map((v) => { v.percent = total > 0 ? ((v.percentage / total) * 100).toFixed(2) + '%' : '0%'; });
    }
    /**文字滚动 */
    mouseover(event, op) {
        let dom = document.getElementById(op.poi_code);
        op.isscroll = dom.scrollWidth > dom.offsetWidth;
    }
    /**工序展示 */
    opShow(event, OP, newOP, par) {
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
                if (!data.mixtureratio || data.mixtureratio === null) {
                    data.mixtureratio = 0;
                }
                if (UtilService.isNotEmpty(data.mixtureratio) || data.mixtureratio == 0) {
                    if (data.mixtureratio < 0) {
                        that.message.error(that.getTipsMsg('warning.vrs'));
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
                    let containerson = (container[event.currentIndex] ? container[event.currentIndex] : container[event.currentIndex - 1])['routelist'];
                    if (!containerson || containerson == null) { containerson = []; }
                    let Index = containerson.findIndex(r => r.bls_key == stationdrags.bls_key);
                    if (Index >= 0) {
                        that.message.warning(that.getTipsMsg('warning.Standingposition'));
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
                    let tq = that.StationAggregation.findIndex(sa => sa.code == stationdrags.bls_code)
                    if (tq >= 0) {
                        that.StationAggregation[tq].poi_list.push({
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
                        that.StationAggregation.push(_routes);
                    }
                }
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
    Disabled = false;
    lockAxis = false;
    dragMoved(e, action) {
        let container: any = e.container.data;
        this.lockAxis = true;
        // if (container.length - 1 == e.currentIndex) this.lockAxis = true; else this.lockAxis = false;
        if (e.item.dropContainer.id == "stodoList") {
            this.Disabled = true;
            if (e.currentIndex > container.length) { return }
            let currentIndex = e.currentIndex - 1 < 0 ? 0 : e.currentIndex - 1;
            this.opShow(null, container[currentIndex], container, this.newFlow.partlist[this.selectedIndex])
        }
    }
    /**工序添加 */
    opAdd(ev) {
        if (this.isDrop('todoList') == false) { return }
        /**是否重复 */
        let isrepeat: boolean;
        let par = this.newFlow.partlist[this.selectedIndex]
        const smodel = this.opParameter.optyle.find(x => x.value === ev.style);
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
                key: this.newmodel.key ? this.newmodel.key : ''
            });
        }
        const nowdate = '工序流导出' + UtilService.dateFormat(new Date(), 'yyyy-MM-dd') + '.xls';
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
        if (!this.newmodel.name || this.newmodel.name == '') {
            this.message.error(this.getTipsMsg('inputdata.input_flowname'));
            this.submiting = false;
            return;
        }
        if (this.power.type == 'W') {
            this.newmodel.pwb_key = this.node.key;
        }
        this.newmodel = Object.assign(this.newmodel, { partlist: this.newFlow.partlist });
        super.save({ url: this.otherUrl.OperationGet, model: this.newmodel, doAction: 'post' }, (result) => {
            if (result) {
                if (!that.newmodel.key) {
                    if (this.power.type != 'W') {
                        let pro = Object.assign({ popm_key: result }, { psi_key: this.node.psi_key })
                        this._service.saveModel(this.otherUrl.StyleSave, 'post', pro)
                    }
                    that.newmodel.key = result;
                    this._service.saveModel(this.otherUrl.WorkBillSave, 'post', { popm_key: result, pwb_key: this.node.pwb_key })
                    this.close()
                    return
                } else
                    that.newmodel.key = result;
            }
            if (this.power.type == 'W') { this.workData(); }
            if (this.power.type == 'S') { this.styleData(); }
        }, false);
    }
    /**复制 */
    copy() {
        let body = { popm_name: this.newmodel.name + "-副本", popm_key: this.newmodel.key, pwb_key: this.node.pwb_key }
        super.save({ url: this.otherUrl.copy, model: body, doAction: 'post' }, (result) => {
            if (result) {
                this.message.success('复制成功！')
                this.onOut.emit()
                this.close(true)
            }
        }, false);

    }
    /**确认并采用 */
    ConfirmAdopt() {
        let pro = Object.assign({ popm_key: this.newmodel.key, pwb_key: this.node.pwb_key })
        this._service.saveModel(this.otherUrl.WorkBillSave, 'post', pro, () => {
            this.message.success('采用成功！');
            this.close()
        })

    }
    /**关闭 */
    close(IS?): void {
        this.avatar = null
        this.visible = false;
        this.newFlow = new Array();
        this.newmodel = {};
        this.selectoeder = {};
        this.submiting = false;
        this.section = new Array();
        this.pormType = new Array();
        this.flowopall = new Array();
        this.listSelectedIndex = 0;
        this.inputValue = null;
        this.filteredOptions = new Array();
        this.bwi_list.forEach(b => b.hidd = false);
        this.nzSelected = '';
        if (IS)
            this.editDone.emit(true);
    }

}