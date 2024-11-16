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
    selector: 'flow-old',
    templateUrl: './comm-flow-old.component.html',
    styleUrls: ['./comm-flow-old.component.less']
})
@Injectable({ providedIn: 'root' })
export class CommFlowOldComponent extends FormTemplateComponent {
    constructor(private http: HttpClient,
        private breakpointObserver: BreakpointObserver,) { super(); }
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
     * optyle:工序类型
     * pageMap:工序分页
     * selectedval:工序搜索
     */
    opParameter: any = { optyle: [], pageMap: { page: 1, pagesize: 10 }, selectedval: '' }
    /**是否加载 */
    loadingMore = false;
    /**加载中 */
    loading = true;
    /**拖拽存放区 */
    doneto = 'doneList';
    /****************************站位**********************************/
    /**布局结构参数 */
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', child: 'sonlist', url: 'LayoutStructure/extend' };
    /**树状站位筛选条件 */
    stationRailtree = { maketree: true, moduletype: 101 };
    /**站位 */
    list_station: any[] = [];
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
    /****************************权限**********************************/
    /**路线图计算方式  */
    routecalculation = 1;
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
    /**初始化 */
    ngOnInit(): void {
        this.otherUrl = this.modular.otherUrl;
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) { this.width = '800px' } else { this.width = '100%' }
        })
    }
    /**打开弹窗 */
    async open(record: any) {
        this.title = this._appService.translate("placard." + record.title);
        this.otherUrl = this.modular.otherUrl;
        this.newOP = new Array();
        if (sessionStorage.bwi_list) {
            let _bwi_list = JSON.parse(sessionStorage.bwi_list);
            if (!this.bwi_list) { this.bwi_list = []; }
            if (_bwi_list) { _bwi_list.forEach(_b => { if (_b && _b != null && _b != undefined) { this.bwi_list.push(_b); } }) }
        }
        if (record) {
            this.node = record.node;
            this.key = record.node.key;
            this._service.getModel('SystemInfo/getroutecalculation/', '', (result) => { this.routecalculation = result; })
            this.copymodel.psi_key = this.node && this.node.psi_key ? this.node.psi_key : '';
            this._service.comList('partinfo', {}).then(sucess => { if (sucess) { this.bpiList = sucess.data; } });
            this.power = Object.assign(this.power, record.power)
            // console.log(this.power)
            if (this.power.sversion) this.versionPower = this.power.sversion;
            this.power.type = record.type;
            if (record.type == 'W') { this.workData(); }
            if (record.type == 'S') { this.styleData(); }
        } else {
            this.key = null
        }
        this.visible = true
    }
    workData() {
        this.node.opp_type = this.node.opp_type ? this.node.opp_type : parseInt(sessionStorage.opp_type);
        this._service.enumList('OperationProcessTypeEnum').then(result => { this.node.opp_type_name = result.find(v => v.value == this.node.opp_type).description });
        if (!this.node.opp_type || this.node.opp_type == 1) {
            this.node.opp_type = 1;
            this.GetParameters();
            this._service.comList('WorkBill/option', { psi_key: this.node.psi_key }).then(sucess => {
                let _data = (sucess instanceof Array) == true ? sucess : sucess.data;
                if (_data) {
                    let n = _data.findIndex(w => w.key == this.node.key);
                    _data.splice(n, 1)
                    this.sameParaWork = _data;
                }
            });
        } else { this.power.flowpower = false; this.power.wages = false; this.power.mappower = false; this.power.IsUpdate = false; }
        this.getList(this.otherUrl.getFlow, { pwb_key: this.node.key });
    }
    styleData() {
        this.GetParameters();
        if (this.node && this.node.key) { this.getMap(); } else {
            this.newmodel = Object.assign({ psorm_key: '', psorm_name: '', psopm_code: '', psopm_name: '', psopm_pci_key: '', psopm_customcode: '' }, this.node);
            this.newmodel.psopm_code = UtilService.shortUUID();
            if (this.node.psi_key)
                this.newmodel.psopm_name = this.getTipsMsg('placard.ProcessFlow') + UtilService.shortUUID();
            if (this.power.ispublic) {
                this.newmodel.ispublic = this.power.ispublic;
                this.newmodel.psopm_name = this.getTipsMsg('placard.commflow') + UtilService.shortUUID();
            }
        }
    }
    /**款式工序流请求 */
    getMap() {
        const that = this;
        let key = that.node.key ? that.node.key : '';
        this._service.getList(this.otherUrl.flow.map, { psopm_key: key }, (Type) => {
            this.pormType = Type;
            const psorm = Type.filter(s => s.psorm_isdefault == true);
            if (psorm && psorm.length > 0) {
                that.newmodel.psorm_key = psorm[0].key;
                that.newmodel.psorm_name = psorm[0].name;
                that.newmodel.psorm_isdefault = psorm[0].psorm_isdefault;
                that.newmodel.psopm_pci_key = psorm[0].psopm_pci_key ? psorm[0].psopm_pci_key : ''
                that.newmodel.psopm_customcode = psorm[0].psopm_customcode ? psorm[0].psopm_customcode : ''
                this.getMapFlow({ psopm_key: key, psorm_key: psorm[0].key });
            } else {
                that.getList(this.otherUrl.flow.Styleget, { psopm_key: key });
            }
        });
    }
    getMapFlow(newmodel) {
        this._service.getPage(this.otherUrl.flow.getmap, newmodel, (result) => {
            let _node = result;
            if (this.CopyProgress == true) {
                _node = Object.assign({}, this.newmodel, { partlist: result.partlist, worksectionlist: result.worksectionlist })
                this.CopyProgress = false;
            }
            this.HandleData(_node, 'is');
        });
    }
    getList(url, body) {
        this._service.getPage(url, body, (result) => {
            // console.log(result, this.CopyProgress)
            if (result) {
                let _node: any = result;
                if (this.CopyProgress == false)
                    this.newmodel = Object.assign({}, result);
                else if (this.CopyProgress == true) {
                    _node = Object.assign({}, this.newmodel, { partlist: result.partlist, worksectionlist: result.worksectionlist })
                    this.CopyProgress = false;
                }
                this.HandleData(_node);
            }
        }, (err) => {
            // this.message.error(err)
        });
    }
    /**工价推送 */
    push(ev) {
        if (UtilService.isEmpty(this.newmodel.psopm_customcode) == true) {
            this.message.error('请填写生产货号！')
            return
        }

        this._Price.open({ title: '工价推送', node: this.newmodel.psopm_customcode })
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
    /**添加路线图 */
    addmap() {
        this.newmodel.psorm_key = ''; this.newmodel.psorm_name = '';
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
                    case 2: this.bwi_list = v; break;
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
            if (bwi && this.section.find(sec => sec.bwi_key == bwi.key)) { bwi.hidd = true; }
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
            if ((that.list_station.length >= 2 && that.list_station[0].blst_key == '101010') || that.list_station[0].blst_key != '101010') {
                that.list_station.forEach(e => { if (!e.mixtureratio) { e.mixtureratio = 1; } });
            } else {
                that.list_station = new Array();
                that.list_station.push(Object.assign({ mixtureratio: 1 }, ev));
            }
        } else {
            that.list_station = new Array();
            that.list_station.push(Object.assign({ mixtureratio: 1 }, ev));
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
    /**工段选择 */
    sectionCheck(seckey, num) {
        this.nzSelected = seckey ? seckey.bwi_code : '';
        this.power.issdiction = this.Jurisdiction(this.section[num]);
        if (!this.newFlow.partlist || this.newFlow.partlist === null) { this.newFlow.partlist = []; }
        this.options = new Array();
        this.newFlow.partlist.forEach((part, pi) => {
            const b = part.worksectionlist.find(x => x.bwi_key === seckey.bwi_key);
            if (!b) {
                let _b = Object.assign({}, seckey, { bwi_sort: num, detaillist: [] })
                part.worksectionlist.push(_b);
                this.newOP[part.bpi_name] = _b.detaillist;
            } else {
                if (!b.detaillist || b.detaillist === null) { b.detaillist = []; }
                b.detaillist.forEach((p, di) => {
                    if (pi == this.selectedIndex && seckey.bwi_key == b.bwi_key) {
                        let _options: any = {
                            title: p.poi_name + '-' + p.poi_code,
                            name: p.poi_name, code: p.poi_code,
                            sort: di + 1
                        }
                        if (p.pyso_operationticket) { _options.pyso_operationticket = p.pyso_operationticket; }
                        this.options.push(_options)
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
                this.section.forEach((element, i) => {
                    if (element.bwi_key != '') {
                        let sec = part.worksectionlist.find(w => w.bwi_key == element.bwi_key);
                        if (sec) {
                            sec.detaillist.forEach((de, di) => {
                                if (de.psopd_key) { de.psopd_key = ''; }
                                that.options.push(de.poi_name + '-' + de.poi_code)
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
            this.newOP[n.bpi_name].forEach(d => { d.checked = false; });
        })
    }
    /**工序选择
     * @param opch 选中工序
     * @param par 当前部件
     */
    isShowPower(opch, par): boolean {
        const that = this;
        if (this.nzSelected == '' || this.power.mappower == false) { return true; }
        let show = par.worksectionlist.find(x => x.bwi_code == this.nzSelected);
        let pwd = show ? show.detaillist : par.worksectionlist[0].detaillist;
        this.newOP[par.bpi_name].forEach(d => { d.checked = false; });
        pwd.forEach(d => { d.checked = false; });
        if (this.power.mappower == true && this.routecalculation == 1) {
            if (this.power.issdiction == true && par.isfold == false) {
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
        // console.log(this.newFlow.partlist)
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
        this.selectedIndex = this.newFlow.partlist.length;
    }
    /**删除部件 */
    closeTab({ index }: { index: number }) {
        this.newFlow.partlist.splice(index, 1);
    }
    /**主部件设置 */
    mainselect(par, ev) {
        if (this.power.IsUpdate != true || this.nzSelected == '') { return; }
        let _ismain = par.bpi_ismain;
        this.Confirm('confirm.confirm_bpimagin', '', (ev) => {
            if (ev == 'pass') {
                this.newFlow.partlist.forEach(newp => { newp.bpi_ismain = false; });
                par.bpi_ismain = true;
            } else {
                par.bpi_ismain = _ismain;
            }
        });
    }
    /**一键折叠 */
    Fold(par, i) {
        par.isfold = !par.isfold;
        // console.log(this.newOP)
        // this.newOP[par.bpi_name].forEach(nf => nf.checked = false)
    }
    /**一键清空路线图 */
    del_map(par) {
        // console.log(par)
        this.Confirm('confirm.confirm_delmap', '', (ev) => {
            if (ev == 'pass') {
                par.worksectionlist.forEach(element => {
                    element.detaillist.forEach(detail => { detail.routelist = []; })
                });
                this.message.success(this.getTipsMsg('sucess.s_delete'));
            }
        })
    }
    /**参数调整*/
    parameter(type, option, i, event, bpi_name) {
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
        // console.log(param)
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
        const that = this;
        let name = '';
        const ordermodel = part[i];
        if (ordermodel && ordermodel.optyle) { name = this.getTipsMsg('placard.Systemprocedure'); }
        this.Confirm('confirm.confirm_deln', name + sname, (ev) => {
            if (ev == 'pass') {
                part.splice(i, 1);
                if (!par && part.length > i) { that.doneto = part[this.selectedIndex].bpi_name; }
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
    outof(pr, OP) {
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
    opShow(event, OP, newOP) {
        newOP.forEach(nc => nc.checked = false)
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
    drop(event: CdkDragDrop<any[]>, list?, par?) {
        // console.log('drop')
        if (this.power.flowpower != true) { return; }
        // if (this.doneto == 'doneList') { return }
        if (this.isDrop(event.previousContainer.id) == false) { return }
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
                        return;
                    }
                    let stationdrags = {
                        bls_key: data.key,
                        percentage: data.mixtureratio,
                        bls_code: data.code,
                        pkey_code: data.pkey_code,
                        checked: false,
                        percent: '100%'
                    };
                    if (event.currentIndex - 1 < 0) { return; }
                    let containerson = container[event.currentIndex - 1]['routelist'];
                    if (!containerson || containerson == null) { containerson = []; }
                    let Index = containerson.findIndex(r => r.bls_key == stationdrags.bls_key);
                    if (Index >= 0) {
                        that.message.warning(that.getTipsMsg('warning.Standingposition'));
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
                                return;
                            }
                        }
                    }
                })
                if (isrepeat == true) { return; }
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
                // console.log(this.nzSelected, par.worksectionlist)
                let show = par.worksectionlist.find(x => x.bwi_code == this.nzSelected);
                if (!show.detaillist) { show.detaillist = [] }
                show.detaillist = list;
                transferArrayItem(drge, container, 0, event.currentIndex);
                that.options.push(data.name + '-' + data.code);
            }
        }
        return;
    }
    /**工序添加 */
    opAdd(ev) {
        if (this.isDrop('todoList') == false) { return }
        let par = this.newFlow.partlist[this.selectedIndex]
        const smodel = this.opParameter.optyle.find(x => x.value === ev.style);
        if (this.newOP[par.bpi_name].find(l => ev.key === l.poi_key) && ev.style == 1000) {
            let wor = this.section.find(ss => ss.bwi_code == this.nzSelected)
            this.message.error(this.getTipsMsg('warning.Processexistence') + wor.bwi_name);
            return;
        }
        const sort = this.newOP[par.bpi_name].findIndex(ns => ns.checked == true)
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
        this.newOP[par.bpi_name].forEach(lc => lc.checked = ev.key == lc.poi_key ? true : false)
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
            let datalist = this.selectoeder.routelist;
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
        // console.log(this.node)
        if (this.power.type == 'W') {
            params = Object.assign({}, { pwb_key: this.node.key });
        }
        if (this.power.type == 'S') {
            params = Object.assign({}, {
                psopm_key: this.newmodel.psopm_key ? this.newmodel.psopm_key : '',
                psorm_key: this.newmodel.psorm_key ? this.newmodel.psorm_key : ''
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
            this.newFlow.partlist.forEach(f => {
                f.worksectionlist.forEach(w => {
                    let isrouter = w.detaillist.find(p => p.routelist && p.routelist.length > 0);
                    if (isrouter) { is = true; return; }
                });
            });
            if (is == true && this.routecalculation == 1) {
                this.newmodel.key = '';
                if (!this.newmodel.psorm_name || this.newmodel.psorm_name == '') {
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
        this.submiting = false;
        this.section = new Array();
        this.pormType = new Array();
        this.editDone.emit(true);
    }

}