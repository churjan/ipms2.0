import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ListTemplateComponent } from "~/shared/common/base/list-template.component";
import { DateSelectContent } from "~/shared/selectInput/date/date.component";

@Component({
    selector: 'Qualitytracking',
    templateUrl: './Qualitytracking.component.html',
    styleUrls: ['./Qualitytracking.component.less']
})
export class QualityTrackingComponent extends ListTemplateComponent {
    @ViewChild('dateselect', { static: false }) _dateselect: DateSelectContent;
    constructor(public router: Router,) {
        super();
        this.modularInit("reportQualitytracking");
        this.url = router.url.replace(/\//g, "_")
        if (this.url.indexOf("_") == 0) {
            this.url = this.url.substring(1, this.url.length)
        }
    }
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'code', url: 'LayoutStructure/extend' }
    onReset(){this._dateselect.Reset()}
}