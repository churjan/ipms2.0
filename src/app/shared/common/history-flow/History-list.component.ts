import { Component, Input, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from "~/shared/common/base/form-Template.component";
import { BackupsComponent } from "./Backups/Backups.component";
import { CrudComponent } from "~/shared/components/crud/crud.component";
import { UtilService } from "~/shared/services/util.service";
declare var $: any;

@Component({
    selector: 'History-flow',
    templateUrl: './History-list.component.html'
})
export class HistoryListComponent extends FormTemplateComponent {
    constructor(private breakpointObserver: BreakpointObserver,) {
        super();
        // this.url = 'pmWork'
    }
    @ViewChild('flowcrud', { static: false }) _flowcrud: CrudComponent;
    @ViewChild('flow', { static: false }) _flow: BackupsComponent;
    /**模块地址 */
    @Input() url: string = '';
    /**列表字段 */
    @Input() Detail: string[] = ['checked', 'hei_code', 'hei_name', 'createtime']
    /**模块 */
    @Input() Component: boolean = true;
    /**对象 */
    @Input() model: any;
    /**通用 */
    @Input() commodel: any;
    /**按钮 */
    @Input() btnaction: string;
    selection = new SelectionModel<any>(true, []);
    body: any = {};
    btnEvent(event) {
        switch (event.action) {
            case 'Look':
                // console.log(event.node, this.model)
                if (!event.node || event.node.length <= 0) {
                    this.message.error(this.getTipsMsg('checkdata.check_leastoneledata'));
                } else if (event.node.length > 2) {
                    this.message.error(this.getTipsMsg('checkdata.check_contrast'));
                } else {
                    let model: any;
                    if ((event.node instanceof Array) == true) {
                        if (event.node.length == 1) {
                            model = Object.assign({}, { old: event.node[0] })
                        } else {
                            if (UtilService.TimeComparison(event.node[0], event.node[1]) == true)
                                model = Object.assign({}, { old: event.node[0], new: event.node[1] })
                            else
                                model = Object.assign({}, { old: event.node[1], new: event.node[0] })
                        }
                    }
                    else model = Object.assign({}, { old: event.node })
                    if (this.Component == true) {
                        model = Object.assign(model, { pwb_code: this.model.code, pwb_key: this.model.key, psi_code: this.model.psi_code });
                    } else {
                        model = Object.assign(model, { code: this.model.code, name: this.model.name,version: this.model.version, psopm_key: this.model.key, psi_code: this.model.psi_code });
                    }
                    this._flow.open({
                        title: 'see',
                        node: model,
                        file: this.url,
                        power: { com: this.Component }
                    });
                }
                break;
        }
    }
    ngOnInit() {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
        this._service.getModel('SystemInfo/getoperationprocesstype/', '', (result) => { sessionStorage.opp_type = result; })
        this.otherUrl = this.modular.otherUrl;
        this.columns = this.modular.historyList;
    }
    async open(record: any) {
        this.title = this._appService.translate("placard." + record.title);
        this.btnaction = record.btnaction
        if (record.node && record.node.key) {
            this.key = record.node.key;
            this.model = record.node;
            this.body = { other_key: this.key };
            if (!this.key || this.key == '') { this.body = Object.assign({}, record.commodel); }
        } else {
            this.key = null
        }
        this.visible = true
    }
    close(): void {
        this.avatar = null
        this.visible = false
    }
}