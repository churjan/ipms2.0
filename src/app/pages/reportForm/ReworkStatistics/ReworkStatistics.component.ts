import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ListTemplateComponent } from "~/shared/common/base/list-template.component";
import { DateSelectContent } from "~/shared/selectInput/date/date.component";

@Component({
    selector: 'app-ReworkStatistics',
    templateUrl: './ReworkStatistics.component.html',
    styleUrls: ['./ReworkStatistics.component.less']
})
export class ReworkStatisticsComponent extends ListTemplateComponent {
    constructor(public router: Router) {
        super();
        this.list = [];
        this.modularInit("reportReworkStatistics",router.url, false);
        this.url = router.url.replace(/\//g, "_")
        if (this.url.indexOf("_") == 0) {
            this.url = this.url.substring(1, this.url.length)
        }
    }
    @ViewChild('dateselect', { static: false }) _dateselect: DateSelectContent;
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', url: 'organizationinfo' }
    onReset() { this._dateselect.Reset() }
}