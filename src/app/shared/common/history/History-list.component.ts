import { Component, Input, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from "~/shared/common/base/form-Template.component";
import { BackupsComponent } from "./Backups/Backups.component";
import { UtilService } from "~/shared/services/util.service";
declare var $: any;

@Component({
    selector: 'History',
    templateUrl: './History-list.component.html'
})
export class HistoryComponent extends FormTemplateComponent {
    constructor(private breakpointObserver: BreakpointObserver,) { super(); }
    @ViewChild('flow', { static: false }) _flow: BackupsComponent;
    @Input() url = '';
    Detail: string[] = ['checked', 'hei_code', 'hei_name', 'createtime']
    @Input() Component: any;
    @Input() model: any;
    @Input() commodel: any;
    @Input() btnaction: any;
    selection = new SelectionModel<any>(true, []);
    body: any = {};
    btnEvent(event) {
        switch (event.action) {
            case 'Look':
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
                        model = Object.assign(model, { pwb_code: this.model.code, popm_key: this.key, psi_code: this.model.psi_code });
                    } else {
                        model = Object.assign(model, { code: this.model.code, name: this.model.name, version: this.model.version, popm_key: this.key, psi_code: this.model.psi_code });
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
    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
        this.otherUrl = this.modular.otherUrl;
        this.columns = this.modular.historyList;
    }
    async open(record: any) {
        this.title = this._appService.translate("placard." + record.title);
        this.btnaction = record.btnaction
        if (record.node && record.node.key) {
            this.key = record.node.popm_key;
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