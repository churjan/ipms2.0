import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { CommFlowComponent } from '~/shared/common/comm-flow/comm-flow.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';
import { HistoryListComponent } from '~/shared/common/history-flow/History-list.component';
import { CommFlowOldComponent } from '~/shared/common/comm-flow-old/comm-flow-old.component';
import { AppConfig } from '~/shared/services/AppConfig.service';

@Component({
    selector: 'styleFlow',
    templateUrl: './styleFlow.component.html',
    styleUrls: ['./styleFlow.component.less']
})
export class StyleFlow2Component extends FormTemplateComponent {
    constructor(private breakpointObserver: BreakpointObserver,) {
        super();
        this.modularInit("pdmStyle", 'pdm_style', false);
        this.url = 'pdm_style';
        let oplistnewbtn = AppConfig.btnGroup.single.find(b => b.action == "oplist");
        this.btnaction = oplistnewbtn && oplistnewbtn.sonbtn ? oplistnewbtn.sonbtn : {};
        // this.btnaction = AppConfig.btnGroup.single.find(b => b.action == "oplist").sonbtn
        this._service.getModel('SystemInfo/getroutecalculation/', '', (result) => { this.routecalculation = result.data; })
        this._service.getModel('SystemInfo/getstyleprocessversion/', '', (result) => { this.sversion = result; })
    }
    @ViewChild('flowcrud', { static: false }) _flowcrud: CrudComponent;
    @ViewChild('flow', { static: false }) _flow: CommFlowComponent;
    // @ViewChild('flow', { static: false }) _flow: CommFlowOldComponent;
    @ViewChild('History', { static: false }) _History: HistoryListComponent;
    url = '';
    @Input() Component: any;
    @Input() model: any;
    @Input() commodel: any;
    @Input() btnaction: any;
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
                this._flow.open({ title: 'PWRM', other_node: { psi_key: this.key }, type: 'S', power: this.power })
                break;
            case 'Update':
                this._flow.open({ title: 'PWRM', node: event.node, type: 'S', power: this.power , other_node: { psi_key: this.key }})
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
}