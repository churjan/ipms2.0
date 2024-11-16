import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ListTemplateComponent } from "~/shared/common/base/list-template.component";
import { DateSelectContent } from "~/shared/selectInput/date/date.component";

@Component({
    selector: 'ReworkStatistics-Custom',
    templateUrl: './ReworkStatistics-Custom.component.html',
    styleUrls: ['./ReworkStatistics-Custom.component.less']
})
export class ReworkStatisticsCustomComponent extends ListTemplateComponent {
    @ViewChild('dateselect', { static: false }) _dateselect: DateSelectContent;
    constructor(public router: Router,) {
        super();
        this.list = [];
        this.modularInit("reportReworkStatistics",router.url, false);
        this.url = router.url.replace(/\//g, "_")
        if (this.url.indexOf("_") == 0) {
            this.url = this.url.substring(1, this.url.length)
        }
    }
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', url: 'organizationinfo' }
    onReset() { this._dateselect.Reset() }
}