import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ListTemplateComponent } from "~/shared/common/base/list-template.component";
import { DateSelectContent } from "~/shared/selectInput/date/date.component";

@Component({
    selector: 'Yield-Custom',
    templateUrl: './Yield-Custom.component.html',
    styleUrls: ['./Yield-Custom.component.less']
})
export class YieldCustomComponent extends ListTemplateComponent {
    @ViewChild('dateselect', { static: false }) _dateselect: DateSelectContent;
    constructor(public router: Router,) {
        super();
        this.modularInit("reportYield");
        this.url = router.url.replace(/\//g, "_")
        if (this.url.indexOf("_") == 0) {
            this.url = this.url.substring(1, this.url.length)
        }
    }
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', child: 'sonlist', url: 'OrganizationInfo' }
    onReset() { this._dateselect.Reset() }
}