import { Component, OnInit, Input } from '@angular/core';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { EmbedModalService } from '~/shared/components/embed-modal/embed-modal.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ProductionPartsService } from '../production-parts.service';

@Component({
    selector: 'app-view-production-parts',
    templateUrl: './view-production-parts.component.html',
    styleUrls: ['./view-production-parts.component.less'],
})
export class ViewProductionPartsComponent extends FormTemplateComponent {
    // @Input() record;
    detailInfo: any = {};

    constructor(
        private breakpointObserver: BreakpointObserver,
        private pps: ProductionPartsService,
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
        this.pps.detail(this.key).then((data) => {
            this.detailInfo = data;
        });
    }


    close(): void {
        this.submiting = false;
        this.avatar = null
        this.visible = false
    }
}
