import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { CommFlowComponent } from '~/shared/common/comm-flow/comm-flow.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { HistoryListComponent } from '~/shared/common/history-flow/History-list.component';
import { CommFlowOldComponent } from '~/shared/common/comm-flow-old/comm-flow-old.component';
import { UtilService } from '~/shared/services/util.service';
import { environment } from '@/environments/environment';
declare var $: any;
@Component({
    selector: 'app-styleFlow',
    templateUrl: './styleFlow.component.html',
    styleUrls: ['./styleFlow.component.less']
})
export class StyleFlowComponent extends FormTemplateComponent {
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
    @ViewChild('flow', { static: false }) _flow: CommFlowComponent;
    // @ViewChild('flow', { static: false }) _flow: CommFlowOldComponent;
    @ViewChild('History', { static: false }) _History: HistoryListComponent;
    url = '';
    @Input() Component: any;
    @Input() model: any;
    @Input() commodel: any;
    @Input() btnaction: any;
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
    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '80%'
            } else {
                this.width = '100%'
            }
        })
        this.otherUrl = this.modular.otherUrl;
        this.columns = this.modular.flow;
    }
    async open(record: any) {
        this.title = this._appService.translate("placard." + record.title);
        this.btnaction = record.btnaction
        this.power = record.power;
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
                this._flow.open({ title: 'PWRM', node: { psi_key: this.key }, type: 'S', power: this.power, UseDiversionScheme: this.UseDiversionScheme, btnGroup: this.btnaction.special })
                break;
            case 'Update':
                this._flow.open({ title: 'PWRM', node: event.node, type: 'S', power: this.power, UseDiversionScheme: this.UseDiversionScheme, btnGroup: this.btnaction.special })
                break;
            case 'Copy':
                let other = { psi_key: this.model.key, iscopy: true };
                if (!this.model.key || this.model.key == '') {
                    other = this.commodel;
                    other.iscopy = true;
                }
                let _title = this.field["styleflow"];
                if (this.commodel && this.commodel.ispublic) { _title = this.field["commflow"]; }
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
}