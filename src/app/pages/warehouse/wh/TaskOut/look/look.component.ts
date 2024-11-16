import { Component, Input } from '@angular/core';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
declare var $: any;
@Component({
    selector: 'TaskOut-look',
    templateUrl: './look.component.html',
    styleUrls: ['./look.component.css']
})
export class LookComponent extends FormTemplateComponent {
    constructor() { super(); }
    @Input() key: string;
    showModel: any = {};
    list = new Array();
    ngOnInit() {
        const that = this;
        this.winResize();
        $(window).resize(function () { that.winResize(); });
        // this._service.enumList('workstatus', (result) => { this.statelist = result; });
    }
    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        if (record.node) {
            this.model = record.node;
            this._service.getModel(this.modular.url, record.node.key, (result) => {
                this.showModel = Object.assign({}, result);
                this.list = result.wwod_list;
            });
        } else { }
        this.visible = true
    }
    close(): void {
        this.avatar = null
        this.visible = false;
    }
}
