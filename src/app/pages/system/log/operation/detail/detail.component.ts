import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OperationLogService } from '~/pages/system/log/operation/operationLog.service';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';

@Component({
    selector: 'detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.less']
})
export class DetailComponent extends FormTemplateComponent {
    constructor(
        private breakpointObserver: BreakpointObserver,
        private operationLogService: OperationLogService
    ) { super(); }
    width: string
    visible: boolean = false
    data: any = {}

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
    }

    async open(record: any) {
        this.title = this._appService.translate("btn.see")
        this.operationLogService.get(record.node.key).then(response => {
            this.data = response
        })
        this.visible = true
    }

    close() {
        this.visible = false
    }

}
