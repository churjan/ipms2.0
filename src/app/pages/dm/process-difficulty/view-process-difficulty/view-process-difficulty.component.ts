import { Component, OnInit, Input } from '@angular/core';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { EmbedModalService } from '~/shared/components/embed-modal/embed-modal.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ProcessDifficultyService } from '../process-difficulty.service';
@Component({
    selector: 'view-process',
    templateUrl: './view-process-difficulty.component.html',
    styleUrls: ['./view-process-difficulty.component.less'],
})
export class ViewProcessDifficultyComponent extends FormTemplateComponent {
    detailInfo: any = {};

    constructor(
        private breakpointObserver: BreakpointObserver,
        private pds: ProcessDifficultyService,
        private ems: EmbedModalService
    ) { super() }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '33rem'
            } else {
                this.width = '100%'
            }
        })
    }
    async open(record: any) {
        this.title = this._appService.translate("btn.see")
        if (record.node) {
            this.key = record.node.key
            if (this.key) {
                this.fetcList();
            }
        } else {
            this.key = null
        }
        this.visible = true
    }

    fetcList() {
        this.pds.detail(this.key).then((data) => {
            this.detailInfo = data;
        });
    }

    close(): void {
        this.submiting = false;
        this.avatar = null
        this.visible = false
    }
}
