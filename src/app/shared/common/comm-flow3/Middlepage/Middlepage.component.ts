import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { CommFlowNewComponent } from '~/shared/common/comm-flow-new/comm-flow-new.component';
import { ImpComponent } from '~/shared/common/imp/imp.component';
import { CommFlowthreeComponent } from '~/shared/common/comm-flow3/comm-flow3.component';
import { UtilService } from '~/shared/services/util.service';

@Component({
    selector: 'Middlepage',
    templateUrl: './Middlepage.component.html',
    styleUrls: ['./Middlepage.component.less']
})
export class MiddlePageComponent extends FormTemplateComponent {
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver) {
        super();
        this.modularInit("commFlow");
    }

    @ViewChild('flow', { static: false }) _flow: CommFlowNewComponent;
    @ViewChild('flow3', { static: false }) _flow3: CommFlowthreeComponent;
    @ViewChild('imp', { static: false }) _imp: ImpComponent;

    @Output() editDone = new EventEmitter<boolean>();
    @Output() onOut = new EventEmitter<boolean>();
    record: any;
    /**独立工序流筛选条件 */
    seniorModel: any = {};
    /**选中复制项 */
    newmodel: any = {};
    /**选中分页标签码 */
    panels = 0;
    /**列表数据 */
    listOfData = new Array();
    /**前置数据 */
    node: any;
    /**权限 */
    power: any;
    /**版本权限 */
    versionPower: any = 1;
    datilvisible: boolean = false;
    /**修改数据 */
    partlist = new Array();
    worksectionlist = new Array();
    /**选中部件 */
    selectindex = 0;
    bwi_list = new Array();
    /**默认数据 */
    default = { parts: [], worksections: [] }
    isreturn: boolean = false
    /**初始化 */
    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })

        this._service.getModel('SystemInfo/getoperationprocessconfig', '', (r) => {
            // this.isoverload = r.schemeoverload;
            // this.routertype = r.distributionmode;
            // this.routecalculation = r.routecalculation;
            if (r.styleprocessversion) this.versionPower = r.styleprocessversion;
            // this.btnstationset = r.UseDiversionScheme && r.UseDiversionScheme == 'true' ? true : false;
            this.partlist = r.default_parts ? r.default_parts : []
            this.worksectionlist = r.default_worksections ? r.default_worksections : []
            if (!this.worksectionlist || this.worksectionlist.length == 0) {
                if (sessionStorage.bwi_list) {
                    let _bwi_list = JSON.parse(sessionStorage.bwi_list);
                    if (!this.bwi_list) { this.bwi_list = []; }
                    if (_bwi_list) {
                        _bwi_list.forEach(_b => {
                            if (_b && _b != null && _b != undefined) { this.bwi_list.push(_b); }
                        })
                    }
                }
                if (!this.bwi_list || this.bwi_list.length == 0) {
                    this._service.comList('WorkSectionInfo/Extend', {}, 'GetMyWorkSectionInfo/').then(v => {
                        this.bwi_list = this.bwi_list.concat(v);
                    })
                }
            }
        }, (err) => {
            // this.isoverload = false;
        })
    }
    /**打开弹窗 */
    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title);
        if (record.isRenew) { this.bwi_list = JSON.parse(sessionStorage.bwi_list); }
        this.node = record.node;
        this.power = Object.assign({}, record.power, { type: record.type })
        this.record = record;
        this.isreturn = (record.isreturn && record.isreturn == true) || (record.node && record.node.isreturn == true) ? true : false;
        if (this.node && this.node.key) this.getDate('StyleOperation');
        this.visible = true
    }
    by: any = {};
    /**数据获取 */
    getDate(url) {
        this.seniorModel = Object.assign({}, this.seniorModel, { psi_key: this.node.psi_key })
        // let body = Object.assign({}, this.panels == 0 ? { psi_key: this.node.psi_key } : this.seniorModel)
        this._service.getModel('admin/OperationProcessMaster/', this.node.key, (node) => {
            this.node = Object.assign(this.node, node)
            if (!node.bpi_ismain || node.bpi_ismain == null) node.bpi_ismain = false;
            this.newmodel = Object.assign({ tag: this.node.tag }, node);
            this.partlist = node.partlist;
            this.worksectionlist = node.worksectionlist
        });
    }
    onSelect(event, data, key, i) {
        if (event) {
            switch (key) {
                case 'bpi_code':
                    if (this.partlist.find(p => p.bpi_key == event.key && p.bpi_sort !== i)) {
                        this.message.error(this.getTipsMsg('warning.existencePartNoRepeat'))
                        return;
                    }
                    data.bpi_code = event.code; data.bpi_name = event.name
                    break;
                case 'bpi_class_name':
                    data.bpi_class_name = event.description;
                    break;
                case 'bwi_code':
                    if (this.worksectionlist.find(w => w.bwi_key == event.key && w.bwi_sort !== i)) {
                        this.message.error(this.getTipsMsg('warning.repeatWorksection'))
                        return;
                    }
                    data.bwi_code = event.code; data.bwi_name = event.name
                    break;
                case 'bpi_ismain':
                    if (this.partlist.find(p => p.bpi_ismain == true && p.bpi_sort !== i)) {
                        this.message.error(this.getTipsMsg('warning.ismainonly'))
                        return;
                    }
                    break
                default:
                    break;
            }
            //     if (!key) {
            //         this.by = event;
            //         this.seniorModel = Object.assign(this.seniorModel, { psi_key: event.psi_key, psz_key: event.psz_key, pci_key: event.pci_key });
            //         this.getDate('WorkBillOperation')
            //     } else {
            //         if (this.by[key] != event.key) {
            //             this.seniorModel.pwb_key = '';
            //             this.by = {};
            //             this.getDate('WorkBillOperation')
            //         }
            //     }
        }
    }
    setImpData(event) { }
    /**操作 */
    onAction(body) {
        let type = this.panels == 1 ? 'W' : "S";
        switch (body.action) {
            case 'add':
                body = Object.assign(body, { node: {}, other_node: this.record.other_node, power: this.power, type: type })
                // this._flow3.open(body)
                break;
            case 'check':
                body = Object.assign(body, { power: this.power, type: this.record.type, ischeck: true, node: { key: body.node.popm_key }, other_node: this.record.other_node })
                this._flow.open(body)
                break;
            case 'Enable':
                let pro = Object.assign({ popm_key: body.node.popm_key, pwb_key: this.record.other_node.key })
                this._service.saveModel(this.otherUrl.WorkBillSave, 'post', pro, () => {
                    this.message.success(this.getTipsMsg('sucess.s_Enable'))
                })
                break;
            case "copy":
                super.save({ url: this.otherUrl.copy, model: this.newmodel, doAction: 'post' }, (result) => {
                    if (result) {
                        this.message.success(this.getTipsMsg('sucess.s_copy'))
                        this.copyingcancel()
                        this.close()
                    }
                }, false);

                break;
            case "imp":
                // let impNode = { key: body.action }
                this._imp.open({ title: 'import' })
                break;
            case "del":
                this.partlist = this.partlist.filter(p => p.bpi_key != body.node.bpi_key);
                break;
            case "delws":
                this.worksectionlist = this.worksectionlist.filter(p => p.bwi_key != body.node.bwi_key);
                break;
            default:
                break;
        }
    }
    copyingcancel() {
        this.listOfData.forEach(l => l.copying = false)
    }
    onOutreturn(ev?) {
        let record = ev
        if (!ev) {
            record = Object.assign({}, this.record, { action: "flowLamin", node: this.record.other_node })
        }
        this.open(record.node)
        // this.onOut.emit(record);
        // this.editDone.emit(record);
        // this.close();
    }
    returmflow() {
        this._flow3.open(this.record)
    }
    decide(data): boolean {
        return !data || this.bwi_list.find(b => b.key == data) ? true : false;
    }
    /**关闭 */
    close(): void {
        this.visible = false;
        this.panels = 0
        this.newmodel = {}
        this.partlist = new Array();
        this.worksectionlist = new Array();
        this.isreturn = false;
        // this.editDone.emit(false);
    }

    addpart() {
        this.partlist = this.partlist.concat([{ bpi_sort: this.partlist.length + 1, worksectionlist: this.worksectionlist }]);
    }
    addworksection() {
        this.worksectionlist = this.worksectionlist.concat([{ bwi_sort: this.worksectionlist.length + 1 }]);
    }
    submitForm(ev) {
        if (!this.newmodel.name) {
            this.message.error(this.getTipsMsg('inputdata.input_xx', this.getTipsMsg('commFlow.name')));
            return;
        }
        if (this.partlist.length == 0 || this.partlist.find(p => UtilService.isEmpty(p.bpi_key) || UtilService.isEmpty(p.bpi_class_code))) {
            this.message.error(this.getTipsMsg('warning.Please_completePartdata'));
            return
        }
        if (!this.partlist.find(p => p.bpi_ismain == true)) {
            this.message.error(this.getTipsMsg('inputdata.input_xx', this.getTipsMsg('commFlow.bpi_ismain')));
            return
        }
        if (this.partlist.filter(p => p.bpi_ismain == true).length > 1) {
            this.message.error(this.getTipsMsg('warning.ismainonly'));
            return
        }
        if (this.worksectionlist.length == 0 || this.worksectionlist.find(w => UtilService.isEmpty(w.bwi_key))) {
            this.message.error(this.getTipsMsg('inputdata.input_xx', this.getTipsMsg('commFlow.section')));
            return
        }
        if (this.record.action == 'copy') {
            let copymodel = Object.assign(this.newmodel, { key: this.node.key })
            super.save({ url: 'admin/OperationProcessMaster/Extend/Copy/', model: copymodel, doAction: 'post' }, (result) => {
                if (result) {
                    this.message.success(this.getTipsMsg('sucess.s_copy'))
                    this.node.key = result;
                    let pro = Object.assign({}, { popm_key: result, psi_key: this.record.other_node.psi_key })
                    this.binding(pro)
                    let newbody = Object.assign({ title: 'PWRM' }, { node: { key: result, bwi_key: this.worksectionlist[0].bwi_key }, worksectionlist: this.worksectionlist, power: this.power, type: this.node.type })
                    this._flow3.open(newbody)
                }
            }, false);
        } else {
            let body = Object.assign({ psi_key: this.record.other_node.psi_key }, this.newmodel, { partlist: this.partlist, worksectionlist: this.worksectionlist })
            this._service.saveModel('admin/OperationProcessMaster/', 'post', body, (sucess) => {
                this.message.success(this.getTipsMsg('sucess.s_save'));
                this.submiting = false;
                let newbody: any = Object.assign({}, this.record, { title: 'PWRM', worksectionlist: this.worksectionlist })
                if (!body.key) {
                    newbody = Object.assign(newbody, { node: { key: sucess, bwi_key: this.worksectionlist[0].bwi_key, name: this.newmodel.name } })
                    let pro = Object.assign({}, { popm_key: sucess, psi_key: this.record.other_node.key });
                    this.binding(pro)
                } else {
                    this.record.node = Object.assign(this.record.node, { bwi_key: this.worksectionlist[0].bwi_key })
                    newbody = Object.assign(newbody, { node: this.record.node })
                    if (this.power.type != 'W') {
                        this._service.saveModel(this.otherUrl.StyleSave, 'post', {
                            popm_key: sucess,
                            psi_key: this.record.other_node.key,
                            key: this.node.binding_key,
                            tag: this.newmodel.tag
                        })
                    }
                }
                this._flow3.open(newbody)
            }, (err) => {
                this.submiting = false
            })
        }
    }

    binding(pro) {
        if (this.power.type != 'W') {
            pro = Object.assign(pro, { tag: this.newmodel.tag })
            this._service.saveModel(this.otherUrl.StyleSave, 'post', pro)
        } else {
            pro = Object.assign(pro, { pwb_key: this.record.other_node.key })
            this._service.saveModel(this.otherUrl.WorkBillSave, 'post', pro)
        }
    }
}
