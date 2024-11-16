import { Component, OnInit, Input } from '@angular/core';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
    selector: 'app-track-config',
    templateUrl: './track-config.component.html',
    styleUrls: ['./track-config.component.less'],
})
export class TrackConfigComponent extends FormTemplateComponent {
    @Input() record;
    constructor(
        private breakpointObserver: BreakpointObserver) {
        super()
    }
    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '99%'
            } else {
                this.width = '100%'
            }
        })
    }

    async open(record: any) {
        this.title = this._appService.translate(record.title)
        if (record.node) {
            this.record = record.node
        }
        this.visible = true
    }
    close(): void {
        this.submiting = false;
        this.avatar = null
        this.visible = false
    }
}
