import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { CommFlowNewComponent } from '~/shared/common/comm-flow-new/comm-flow-new.component';
import { ImpComponent } from '~/shared/common/imp/imp.component';
import { CommFlowthreeComponent } from '~/shared/common/comm-flow3/comm-flow3.component';
import { MiddlePageComponent } from '~/shared/common/comm-flow3/Middlepage/Middlepage.component';

@Component({
    selector: 'flowLamination',
    templateUrl: './flowLamination.component.html',
    styleUrls: ['./flowLamination.component.less']
})
export class FlowLaminationComponent extends FormTemplateComponent {
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver
    ) {
        super();
        this.modularInit("commFlow");
    }

    @ViewChild('flow', { static: false }) _flow: CommFlowNewComponent;
    @ViewChild('flow3', { static: false }) _flow3: CommFlowthreeComponent;
    @ViewChild('imp', { static: false }) _imp: ImpComponent;
    @ViewChild('Middlepage', { static: false }) _Middlepage: MiddlePageComponent;

    @Output() editDone = new EventEmitter<boolean>();
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
    // node: any;
    /**权限 */
    power: any;
    /**分页 */
    @Input() pageMap: any = {
        page: 1,
        pagesize: 15
    }
    @Input() options: any = {
        total: 1, //总条数
        pageList: [15, 30, 45, 50, 100, 200] //每页显示条数
    }
    datilvisible: boolean = false;
    copyvisible: boolean = false;
    /**修改数据 */
    partlist = new Array();
    worksectionlist = new Array();
    /**选中部件 */
    selectindex = 0;
    bwi_list = new Array();
    /**默认数据 */
    default = { parts: [], worksections: [] }
    /**初始化 */
    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
    }
    /**打开弹窗 */
    async open(record: any) {
        this.title = this._appService.translate("placard." + record.title);
        // this.node = record.node;
        this.power = record.power
        this.record = record;
        if (record.other_node && record.other_node.key && record.isNull != true) {
            this._Middlepage.open(record);
        } else if (record.action == 'copy') {
            this._Middlepage.open(record);
        } else {
            this.seniorModel = Object.assign({}, this.seniorModel, { psi_key: record.other_node.psi_key })
            this.getDate('StyleOperation', this.seniorModel);
            this.seniorModel = Object.assign({}, this.seniorModel, { psi_key: record.other_node.psi_key })
            this.visible = true
        }
    }
    by: any = {};
    /**数据获取 */
    getDate(url, body: any = {}) {
        body = Object.assign({}, this.pageMap, this.seniorModel)
        this._service.getPage(this.modular.otherUrl[url], body, (node) => {
            this.listOfData = node.data;
            this.options.total = node.total;
        });
    }
    onSelect(event, key) {
        if (event) {
            if (!key) {
                this.by = event;
                this.seniorModel = Object.assign(this.seniorModel, { psi_key: event.psi_key, psz_key: event.psz_key, pci_key: event.pci_key });
                this.getDate('StyleOperation', this.seniorModel)
            } else {
                if (this.by[key] != event.key) {
                    this.seniorModel.pwb_key = '';
                    this.by = {};
                    this.getDate('StyleOperation', this.seniorModel)
                }
            }
        }
    }
    setImpData(event) {
        this._service.saveModel(this.otherUrl.WorkBillSave, 'post', { popm_key: event, pwb_key: this.record.other_node.key }, (sucess) => {
            let record = Object.assign({}, this.record, { action: "flowLamin", node: this.record.other_node })
            this.editDone.emit(record);
            this.close();
        })
    }
    /**操作 */
    onAction(body) {
        // let type = this.panels == 1 ? 'W' : "S";
        body = Object.assign(body, { other_node: this.record.other_node, power: this.power, type: 'W' })
        switch (body.action) {
            case 'add':
                body = Object.assign(body, { other_node: this.record.other_node, power: this.power, type: 'W' })
                // this._flow3.open(body)
                // console.log(body)
                this._Middlepage.open(body);
                break;
            case 'check':
                // this._flow.open(body)  let pro = Object.assign({}, { popm_key: result, psi_key: this.node.psi_key })
                this._service.saveModel(this.otherUrl.WorkBillSave, 'post', { popm_key: body.node.popm_key, pwb_key: this.record.other_node.key, psi_key: this.record.other_node.psi_key }, (scss) => {

                    this._service.getModel('admin/OperationProcessMaster/', body.node.popm_key, (s) => {
                        body = Object.assign(body, { ischeck: true, node: s, worksectionlist: s.worksectionlist })
                        if (s.worksectionlist.length > 0) { body.node.bwi_key = s.worksectionlist[0].bwi_key }
                        // this._flow3.open(body);
                        this.close();
                    })
                    // body = Object.assign(body, { ischeck: true, node: { key: body.node.popm_key } })
                    // this._flow3.open(body)
                    // this._Middlepage.open(body);
                })
                // this._flow3.open(body)
                break;
            case 'preview':
                // console.log(body)
                body = Object.assign(body, { node: { key: body.node.popm_key, name: body.node.name } })
                // this._flow.open(body)
                // this._Middlepage.open(body);
                this._flow3.open(body)
                break;
            case 'copypreview':
                body = Object.assign(body, { node: { key: body.node.popm_key, name: body.node.name } })
                this._flow3.open(body)
                break;
            case 'Enable':
                let pro = Object.assign({ popm_key: body.node.popm_key, pwb_key: this.record.other_node.key })
                this._service.saveModel(this.otherUrl.WorkBillSave, 'post', pro, () => {
                    this.message.success(this.getTipsMsg('sucess.s_Enable'))
                })
                break;
            case "copy":
                if (this.newmodel.name == '') {
                    this.message.error(this.getTipsMsg('sucess.inputdata.input_name'))
                    return
                }
                super.save({ url: this.otherUrl.copy, model: this.newmodel, doAction: 'post' }, (result) => {
                    if (result) {
                        this.message.success(this.getTipsMsg('sucess.s_copy'))
                        this.copyingcancel()
                        this.close()
                    }
                }, false);

                break;
            case "copynew":
                if (this.newmodel.name == '') {
                    this.message.error(this.getTipsMsg('inputdata.input_name'))
                    return
                }
                this.newmodel = Object.assign(this.newmodel, { key: body.node.popm_key })
                super.save({ url: 'admin/OperationProcessMaster/Extend/Copy/', model: this.newmodel, doAction: 'post' }, (result) => {
                    if (result) {
                        // this.message.success('复制成功！')
                        let pro = Object.assign({}, { popm_key: result, psi_key: this.record.other_node.psi_key, pwb_key: this.record.other_node.key })
                        this._service.saveModel(this.otherUrl.WorkBillSave, 'post', pro, (scss) => {
                            body = Object.assign({}, { title: 'partBwiSet', power: this.power, type: 'W', ischeck: true, other_node: this.record.other_node, node: { key: result } })
                            this._Middlepage.open(body);
                        })
                        this.copyingcancel()
                        this.close()
                    }
                }, false);

                break;
            case "imp":
                // let impNode = { key: body.action }
                this._imp.open({ title: 'import' })
                break;
            default:
                break;
        }
    }
    copyingcancel() {
        this.listOfData.forEach(l => l.copying = false)
    }
    onOut(ev?) {
        // this.record.action = "flowLamin";
        let record = ev
        if (!ev) {
            record = Object.assign({}, this.record, { action: "flowLamin", node: this.record.other_node })
        }
        this.editDone.emit(record);
        this.close();
    }
    /**关闭 */
    close(): void {
        this.visible = false;
        this.panels = 0
        this.copyvisible = false
        // this.editDone.emit(false);
    }
}
