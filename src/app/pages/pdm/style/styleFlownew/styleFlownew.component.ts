import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { UtilService } from '~/shared/services/util.service';
import { environment } from '@/environments/environment';
import { CommFlowthreeComponent } from '~/shared/common/comm-flow3/comm-flow3.component';
import { MiddlePageComponent } from '~/shared/common/comm-flow3/Middlepage/Middlepage.component';
import { ImpComponent } from '~/shared/common/imp/imp.component';
import { HistoryComponent } from '~/shared/common/history/History-list.component';
declare var $: any;
@Component({
    selector: 'styleFlow-new',
    templateUrl: './styleFlownew.component.html',
    styleUrls: ['./styleFlownew.component.less']
})
export class StyleFlowNewComponent extends FormTemplateComponent {
    constructor(private breakpointObserver: BreakpointObserver,) {
        super();
        this.url = 'pdm_style'
        this._service.getModel('SystemInfo/getroutecalculation/', '', (result) => { this.routecalculation = result.data; })
        this._service.getModel('SystemInfo/getstyleprocessversion/', '', (result) => { this.sversion = result; })
        this._service.getModel('SystemInfo/getusediversionscheme/', '', (result) => { this.UseDiversionScheme = result ? result : false })
        // this.btnGroup = this._authService.getBtn(this.url);
        // console.log( this.btnGroup)
    }
    // btnGroup: any = {}
    @ViewChild('flowcrud', { static: false }) _flowcrud: CrudComponent;
    @ViewChild('flow3', { static: false }) _flow3: CommFlowthreeComponent;
    // @ViewChild('flow', { static: false }) _flow: CommFlowOldComponent;
    @ViewChild('History', { static: false }) _History: HistoryComponent;
    @ViewChild('Middlepage', { static: false }) _Middlepage: MiddlePageComponent;
    url = '';
    @Input() Component: any;
    @Input() model: any;
    @Input() commodel: any;
    @Input() btnaction: any;
    /**是否刷新工段权限 */
    @Input() isRenew: boolean = false;
    copyvisible: boolean = false;
    /**分流方案权限  */
    UseDiversionScheme: boolean;
    list: any = [];
    selection = new SelectionModel<any>(true, []);
    body: any = {};
    /**路线图计算方式  */
    routecalculation = 1;
    /**款式工序流版本  */
    sversion = 1;
    power: any = {}
    @Output() editDone = new EventEmitter<boolean>();
    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '80%'
            } else {
                this.width = '100%'
            }
        })
        this.otherUrl = this.modular.otherUrl;
        this.columns = this.modular.flownew;
    }
    async open(record: any) {
        this.title = this._appService.translate("placard." + record.title);
        this.btnaction = record.btnaction
        this.power = record.power;
        this.node = record.node;
        this.record = record;
        if (record.node && record.node.key) {
            this.key = record.node.key
            this.body = { psi_key: this.key };
            if (!this.key || this.key == '') { this.body = Object.assign({}, record.commodel); }
        } else {
            this.key = null;
            this.body = { psi_key: '', ispublic: this.power.ispublic };
        }
        this.visible = true
    }
    btnEvent(event) {
        this.power = Object.assign(this.power, { routecalculation: this.routecalculation, sversion: this.sversion })
        switch (event.action) {
            case 'Add':
                this._Middlepage.open({ title: 'PWRM', other_node: this.node, node: { psi_key: this.key }, type: 'S', power: this.power, UseDiversionScheme: this.UseDiversionScheme, btnGroup: this.btnaction.special })
                break;
            case 'Update':
                this._service.getModel('admin/OperationProcessMaster/', event.node.popm_key, (s) => {
                    let body = Object.assign({}, s, { psi_key: this.key, flowstate: true, bwi_key: s.worksectionlist[0].bwi_key })
                    this._flow3.open({ title: 'PWRM', node: body, other_node: this.node, type: 'S', power: this.power, worksectionlist: s.worksectionlist, UseDiversionScheme: this.UseDiversionScheme, btnGroup: this.btnaction.special })
                })
                break;
            case 'setPW':
                let setbody = Object.assign({}, { title: 'PWRM', power: this.power, type: 'S', ischeck: true, other_node: this.node, isRenew: this.isRenew, node: { key: event.node.popm_key, psi_key: this.key, binding_key: event.node.key, tag: event.node.tag } });
                this._Middlepage.open(setbody);
                break;
            case 'Copy':
                this.copyvisible = true
                this.seniorModel.psi_key = this.node.key
                this._service.getModel('SystemInfo/getoperationprocessconfig', '', (r) => {
                    if (r.styleprocessversion) this.versionPower = r.styleprocessversion;
                }, (err) => { })
                // let other = { psi_key: this.model.key, iscopy: true };
                // if (!this.model.key || this.model.key == '') {
                //     other = this.commodel;
                //     other.iscopy = true;
                // }
                // let _title = this.field["styleflow"];
                // if (this.commodel && this.commodel.ispublic) { _title = this.field["commflow"]; }
                // super.openModal({}, StyleFlowInfoComponent, { title: _title, size: 'slg',result: 1 }, other, this.Component)
                break;
            case 'History':
                this._History.open({ title: 'flowHistory', node: event.node, btnaction: this.modular.historybtn })
                break;
            case 'setlaborrate':
                this.laborratevisible = true;
                this.getlabor();
                // this._History.open({ title: 'flowHistory', node: event.node, btnaction: this.modular.historybtn })
                break;
            case 'Reset':
                this.GetList();
                break;
            case 'Reflux':
                // this._modalService.confirm({
                //     nzTitle: this._appService.translate("confirm.confirm_Reflux"),
                //     nzContent: '',
                //     nzOnOk: () => {
                // event.node.isbackflow = !event.node.isbackflow ? true : event.node.isbackflow;
                let body = Object.assign({}, event.node)
                // if (body.isbackflow == null) { body.isbackflow = true }
                this._service.comPost(this.otherUrl.Reflux, body).then((result) => {
                    this._flowcrud.reloadData(null)
                    this.message.success(this.getTipsMsg('sucess.s_set'));
                }, (msg) => { });
                //     }
                // });
                break;
            case 'return':
                this._Middlepage.open(event.node)
                return
        }
        // super.btnEvent(event);
    }
    GetList() {
        const that = this;
        let body = { psi_key: this.model.key }
        if (!this.model.key || this.model.key == '') { body = Object.assign({}, this.commodel); }
        this._service.getList(this.otherUrl.S.url, body, function (result) {
            result.data.forEach(r => r.checked = false)
        }, function (err) { });
    }
    close(): void {
        this.avatar = null
        this.visible = false
    }
    laborratevisible: boolean = false;
    listOfData = new Array()
    searchValue: any = { poi_code: '', poi_name: '' };
    poi_namevisible = false;
    poi_codevisible = false;
    getlabor() {
        this._service.getList('admin/styleoperationattribute/', { psi_key: this.body.psi_key }, v => {
            this.listOfData = v;
        })
    }
    submitForm() {
        this._service.saveModel('admin/styleoperationattribute/extend/batch', 'post', this.listOfData, (s) => {
            this.message.success(this.getTipsMsg('sucess.s_save'))
        })
    }
    laborclose() {
        this.laborratevisible = false;
        this.reset();
    }
    /**下载报表 */
    downloadreport() {
        const nowdate = this.getTipsMsg('placard.laborrate') + this.getTipsMsg('btn.export') + UtilService.dateFormat(new Date(), 'yyyy-MM-dd') + '.xls';
        const downloadUrl = environment.baseUrl + '/' + 'public/styleoperationattribute/leadingout/';

        this._httpservice.download(downloadUrl, nowdate, { psi_key: this.body.psi_key });
    }
    searchlength = { all: 0, select: 0, node: [], favorite: '', highlight: '' }
    search() {
        // if ($(".highlight") && $(".highlight").length > 0)
        //     $(".labortable")[0].innerHTML = $(".labortable")[0].innerHTML.replaceAll($(".highlight")[0].outerHTML, this.searchlength.highlight)
        let _favorite = ''
        if (this.poi_namevisible == true) _favorite = 'poi_name'
        if (this.poi_codevisible == true) _favorite = 'poi_code'
        this.listOfData.forEach(s => { if (s[_favorite + 'label']) s[_favorite + 'label'] = []; })
        if (this.searchValue[_favorite] != '') {
            let sli = this.listOfData.filter(option => option[_favorite].indexOf(this.searchValue[_favorite]) >= 0);
            this.searchlength.all = sli.length;
            this.searchlength.select = sli.length > 0 ? 1 : 0;
            this.searchlength.node = sli;
            this.searchlength.favorite = _favorite;
            const highlight = this.searchValue[_favorite];
            this.searchlength.highlight = highlight;
            this.listOfData.forEach(s => {
                if (s[_favorite].indexOf(this.searchValue[_favorite]) >= 0) {
                    let label = s[_favorite].split(highlight);
                    for (let l = 0; l < label.length; l++) {
                        if (label[l] == '') label[l] = highlight;
                    }
                    s[_favorite + 'label'] = label;
                }
            })
            // let content = $(".labortable ." + _favorite)
            // let replaceStr = '<span class="highlight">' + highlight + '</span>';
            // for (let i = 0; i < content.length; i++) {
            //     content[i].innerHTML = content[i].innerHTML.replaceAll(highlight, replaceStr)
            // }
            this.position(0);
        } else {
            this.searchlength = { all: 0, select: 0, node: [], favorite: '', highlight: '' }
        }
        // console.log(content)
    }
    position(l) {
        let { node, select } = this.searchlength;
        if (node && node.length > 0) {
            let check = select - 1 + l;
            let hash: any = $("tr[id='" + node[check].poi_code + "']");
            let top = hash[0].offsetTop;
            $(".ant-table-body").animate({ scrollTop: top }, 500);
            this.searchlength.select = this.searchlength.select + l;
        }
        // this.poi_codevisible = false;
        // this.poi_namevisible = false;
    }
    reset() {
        this.searchValue = { poi_code: '', poi_name: '' };
        this.searchlength = { all: 0, select: 0, node: [], favorite: '', highlight: '' };
        this.poi_codevisible = false;
        this.poi_namevisible = false;
    }
    @ViewChild('imp', { static: false }) _imp: ImpComponent;
    seniorModel: any = {}
    copylistOfData = new Array();
    /**分页 */
    @Input() pageMap: any = {
        page: 1,
        pagesize: 15
    }
    @Input() options: any = {
        total: 1, //总条数
        pageList: [15, 30, 45, 50, 100, 200] //每页显示条数
    }
    /**选中复制项 */
    newmodel: any = {};
    /**前置数据 */
    node: any;
    record: any;
    /**版本权限 */
    versionPower: any = 1;
    copyclose() {
        this.copyvisible = false;
    }
    by: any = {};
    /**数据获取 */
    getDate(url, select?) {
        this.seniorModel = Object.assign({ psi_key: this.node.key }, this.seniorModel, select)
        let body = Object.assign({}, this.pageMap, this.seniorModel)
        this._service.getPage(this.modular.otherUrl[url], body, (node) => {
            this.copylistOfData = node.data;
            this.options.total = node.total;
        });
    }
    onSelect(event, key) {
        if (event) {
            if (this.by[key] != event.key) {
                this.by = event;
                this.getDate('StyleOperation', { psi_key: event.key })
            }
        }
    }
    /**操作 */
    onAction(body) {
        body = Object.assign(body, { power: this.power, type: "S", other_node: this.node })
        switch (body.action) {
            case 'add':
                body = Object.assign(body, { other_node: { psi_key: this.key } })
                // this._flow3.open(body)
                this._Middlepage.open(body);
                break;
            case 'check':
                // this._flow.open(body)  let pro = Object.assign({}, { popm_key: result, psi_key: this.node.psi_key })
                this._service.saveModel(this.otherUrl.WorkBillSave, 'post', { popm_key: body.node.popm_key, psi_key: this.node.psi_key }, (scss) => {
                    body = Object.assign(body, { ischeck: true, node: { key: body.node.popm_key, psi_key: this.node.key } })
                    this._Middlepage.open(body);
                })
                // this._flow3.open(body)
                break;
            case 'preview':
                body = Object.assign(body, { ischeck: true, node: { key: body.node.popm_key, psi_key: this.node.key } })
                // this._flow.open(body)
                this._Middlepage.open(body);
                // this._flow3.open(body)
                break;
            case 'Enable':
                let pro = Object.assign({ popm_key: body.node.popm_key, pwb_key: this.node.key })
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
            case "copynew":
                this.newmodel = Object.assign(this.newmodel, { key: body.node.popm_key })
                super.save({ url: 'admin/OperationProcessMaster/Extend/Copy/', model: this.newmodel, doAction: 'post' }, (result) => {
                    if (result) {
                        // this.message.success('复制成功！')
                        let pro = Object.assign({}, { popm_key: result, psi_key: this.node.key, tag: this.newmodel.tag })
                        this._service.saveModel(this.otherUrl.StyleSave, 'post', pro, (scss) => {
                            body = Object.assign({}, { title: 'PWRM', power: this.power, type: 'S', ischeck: true, other_node: this.node, node: { key: result, psi_key: this.node.pkey } })
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
        this.copylistOfData.forEach(l => l.copying = false)
    }
    setImpData(event, flowcrud?) {
        this._service.saveModel(this.otherUrl.StyleSave, 'post', { popm_key: event, psi_key: this.node.key }, (sucess) => {
            if (flowcrud) this._flowcrud.reloadData(true); else this.copyclose();
        })
    }
    onOut() {
        // this.record.action = "flowLamin";
        let record = Object.assign({}, this.record, { action: "flowLamin", node: { key: this.node.pwb_key, psi_key: this.node.psi_key } })
        this.editDone.emit(record);
        this.close();
    }
}