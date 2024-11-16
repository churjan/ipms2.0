import { Component, OnInit } from "@angular/core";
import { FormTemplateComponent } from "~/shared/common/base/form-Template.component";

@Component({
    selector: 'app-rule-info',
    templateUrl: './rule-info.component.html',
    styleUrls: ['./rule-info.component.less'],
})
export class RuleInfoComponent extends FormTemplateComponent {
    constructor() { super() }
    model: any = {};
    ngOnInit(): void { }
    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        if (record.node) {
            this.key = record.node.key;
            this.model = Object.assign({}, record.node)
            this._service.comList('LayoutStructureSchemeRulesDetail', { blsr_key: record.node.blsr_key ? record.node.blsr_key : record.node.key }, 'getlist').then((response: any) => {
                response.forEach(r => {
                    if (!this.model.infolist) { this.model.infolist = new Array(); }
                    if (r.optionmode == "customselect") {
                        let optionvalue = JSON.parse(r.optionvalue);
                        let valuemode = optionvalue.find(o => o.value == r.value);
                        this.model.infolist.push({ blr_name: r.blr_name|| r.name, comparetype: r.comparetype, value_name: valuemode.name });
                    } else {
                        this.model.infolist.push(r);
                    }
                })
            })
        } else {
            this.key = null;
        }
        this.visible = true
    }
    close() { this.visible = false }
}