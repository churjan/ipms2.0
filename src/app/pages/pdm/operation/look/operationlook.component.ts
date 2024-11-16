import { Component, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
// import { FlowInfoComponent } from './flow/flow-info.component';
declare var $: any;
@Component({
    selector: 'operationlook',
    templateUrl: './operationlook.component.html',
    styleUrls: ['./operationlook.component.css']
})
export class OperationLookComponent extends FormTemplateComponent {
    constructor(private breakpointObserver: BreakpointObserver,) { super(); }
    @Input() key: string;
    @Input() Component: any;
    @Input() model: any;
    @Input() commodel: any;
    Columns: string[] = ['No', 'name', 'code', 'isdefault', 'version', 'operation']
    list: any[];
    Extend: any = {};
    btnList?: any[] = [];
    menuUrl: string = '';
    ngOnInit() {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => { })
    }
    async open(record: any) {
        this.title = this._appService.translate('btn.'+record.title)
        if (record.node && record.node.key) {
            this.key = record.node.key
            const that = this;
            this._service.getModel(this.modular.url, this.key, (params) => {
                that.model = params;
            }, function (err) { });
        } else {
            this.key = null
        }
        this.visible = true
    }
    getbutlist() {
        this._service.getList(this.otherUrl.btnurl, { smi_key: this.ComponentParam.id }, (v: any) => {
            if (v.code == 0) { this.btnList = v.data; }
        }, (err: any) => { })
    }
    indexOf(action) {
        const sModel = this.btnList.find(x => x.action == action);
        if (sModel) { return true; } else { return false; }
    }
    close(): void {
        this.avatar = null
        this.visible = false
    }

}
