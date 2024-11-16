import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ListTemplateComponent } from "~/shared/common/base/list-template.component";

@Component({
    selector: 'Hangersrecord',
    templateUrl: './Hangersrecord.component.html',
    styleUrls: ['./Hangersrecord.component.less']
})
export class HangersrecordComponent extends ListTemplateComponent {
    constructor(public router: Router,) {
        super();
        this.modularInit("reportHangersrecord",router.url);
        // this.url = router.url.replace(/\//g, "_")
        // if (this.url.indexOf("_") == 0) {
        //     this.url = this.url.substring(1, this.url.length)
        // }
    }
}