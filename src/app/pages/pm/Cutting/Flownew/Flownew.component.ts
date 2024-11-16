import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { CommFlowthreeComponent } from '~/shared/common/comm-flow3/comm-flow3.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { AppConfig } from '~/shared/services/AppConfig.service';
import { environment } from '@/environments/environment';
import { UtilService } from '~/shared/services/util.service';
declare var $: any;
@Component({
    selector: 'Flow-new',
    templateUrl: './Flownew.component.html',
    styleUrls: ['./Flownew.component.less']
})
export class FlowNew2Component extends FormTemplateComponent {
    constructor(
        private breakpointObserver: BreakpointObserver
    ) {
        super();
        this.modularInit("pdmStyle", 'pdm_style', false);
        this.url = 'pdm_style'
        let sonbtn = AppConfig.btnGroup.single.find(b => b.action == "oplistnew").sonbtn;
        if (sonbtn) {
            sonbtn.common = sonbtn.common.filter(sc => sc.action == "setlaborrate")
            sonbtn.single = sonbtn.single.filter(sc => sc.action == "Update")
            sonbtn.extend = []
            this.btnaction = sonbtn
        }
    }
    @ViewChild('flowcrud', { static: false }) _flowcrud: CrudComponent;
    @ViewChild('flow3', { static: false }) _flow3: CommFlowthreeComponent;

    @Output() editDone = new EventEmitter<boolean>();
    record: any;
    /**独立工序流筛选条件 */
    seniorModel: any = {};
    /**选中分页标签码 */
    panels = 0;
    /**列表数据 */
    listOfData = new Array();
    /**前置数据 */
    node: any;
    /**分流方案权限  */
    UseDiversionScheme: boolean;
    /**权限 */
    power: any;
    /**款式工序流版本  */
    sversion = 1;
    @Input() model: any;
    /**详细访问 */
    datilvisible: boolean = false;
    /**修改数据 */
    partlist = new Array();
    worksectionlist = new Array();
    bwi_list = new Array();
    /**默认数据 */
    default = { parts: [], worksections: [] }
    /**工价访问 */
    laborratevisible: boolean = false;
    searchValue: any = { poi_code: '', poi_name: '' };
    poi_namevisible = false;
    poi_codevisible = false;
    body: any = {};
    searchlength = { all: 0, select: 0, node: [], favorite: '', highlight: '' }
    @Input() btnaction: any;
    @Input() commodel: any;
    by: any = {};
    /**初始化 */
    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
        this.otherUrl = this.modular.otherUrl;
        this.columns = this.modular.flownew;
    }
    /**打开弹窗 */
    async open(record: any) {
        this.title = this._appService.translate("placard." + record.title);
        // this.btnaction = record.btnaction
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
    setImpData(event) {
        this._service.saveModel(this.otherUrl.WorkBillSave, 'post', { popm_key: event, pwb_key: this.record.other_node.key }, (sucess) => {
            let record = Object.assign({}, this.record, { action: "flowLamin", node: this.record.other_node })
            this.editDone.emit(record);
            this.close();
        })
    }
    /**操作 */
    onAction(event) {
        switch (event.action) {
            case 'Update':
                this._service.getModel('admin/OperationProcessMaster/', event.node.popm_key, (s) => {
                    let body = Object.assign({}, s, { psi_key: this.key, flowstate: true, bwi_key: s.worksectionlist[0].bwi_key })
                    this._flow3.open({ title: 'PWRM', node: body, other_node: this.node, type: 'S', power: this.power, worksectionlist: s.worksectionlist, UseDiversionScheme: this.UseDiversionScheme, btnGroup: this.btnaction.special })
                })
                break;
            case 'setlaborrate':
                this.laborratevisible = true;
                this.getlabor();
                // this._History.open({ title: 'flowHistory', node: event.node, btnaction: this.modular.historybtn })
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
        }
    }
    getlabor() {
        this._service.getList('admin/styleoperationattribute/', { psi_key: this.body.psi_key }, v => {
            this.listOfData = v;
        })
    }
    search() {
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
            this.position(0);
        } else {
            this.searchlength = { all: 0, select: 0, node: [], favorite: '', highlight: '' }
        }
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
    reset() {
        this.searchValue = { poi_code: '', poi_name: '' };
        this.searchlength = { all: 0, select: 0, node: [], favorite: '', highlight: '' };
        this.poi_codevisible = false;
        this.poi_namevisible = false;
    }
    /**下载报表 */
    downloadreport() {
        const nowdate = this.getTipsMsg('placard.laborrate') + this.getTipsMsg('btn.export') + UtilService.dateFormat(new Date(), 'yyyy-MM-dd') + '.xls';
        const downloadUrl = environment.baseUrl + '/' + 'public/styleoperationattribute/leadingout/';

        this._httpservice.download(downloadUrl, nowdate, { psi_key: this.body.psi_key });
    }
    /**关闭 */
    close(): void {
        this.avatar = null
        this.visible = false
    }
}