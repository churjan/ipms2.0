import { Component } from "@angular/core";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from "~/shared/common/base/form-Template.component";

@Component({
    selector: 'pm-hanginfo',
    templateUrl: './hanginfo.component.html',
    styleUrls: ['./hanginfo.component.less']
})
export class HangInfoComponent extends FormTemplateComponent {
    constructor(private breakpointObserver: BreakpointObserver,) { super(); }
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
        this.title = this._appService.translate("btn." + record.title)
        if (record.node) {
            this.model = record.node;
        } else {}
        this.visible = true
    }
    close(): void {
        this.avatar = null
        this.visible = false;
    }
}