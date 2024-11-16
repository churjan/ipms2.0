import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TaskOutEditComponent } from "~/pages/warehouse/wh/TaskOut/TaskOutEdit/TaskOutEdit.component";
import { ListTemplateComponent } from "~/shared/common/base/list-template.component";
import { DateSelectContent } from "~/shared/selectInput/date/date.component";
import { AppConfig, modularList } from "~/shared/services/AppConfig.service";

@Component({
    selector: 'app-InventoryStatistics',
    templateUrl: './InventoryStatistics.component.html',
    styleUrls: ['./InventoryStatistics.component.less']
})
export class InventoryStatisticsComponent extends ListTemplateComponent {
    constructor(public router: Router) {
        super();
        this.list = [];
        this.modularInit("reportInventoryStatistics", router.url);
        this.url = router.url.replace(/\//g, "_")
        if (this.url.indexOf("_") == 0) {
            this.url = this.url.substring(1, this.url.length)
        }
    }
    @ViewChild('dateselect', { static: false }) _dateselect: DateSelectContent;
    @ViewChild('TaskOutEdit', { static: false }) _TaskOutEdit: TaskOutEditComponent;
    othermodular: any = {}
    onReset() { this._dateselect.Reset() }
    btnEvent(ev) {
        switch (ev.action) {
            case 'taskout':
                this.othermodular = Object.assign({}, modularList['whTaskOut'], { fields: AppConfig.fields.whTaskOut, columns: AppConfig.columns.whTaskOut })
                this._TaskOutEdit.open({ title: this.getTipsMsg('placard.taskout'), node: Object.assign(ev.node, { inventory_type: ev.node.type }) })
                break;

            default:
                break;
        }
    }
}