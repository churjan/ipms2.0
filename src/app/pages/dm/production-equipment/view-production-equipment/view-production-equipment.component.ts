import { Component, OnInit, Input } from '@angular/core';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { EmbedModalService } from '~/shared/components/embed-modal/embed-modal.service';
import { ProductionEquipmentService } from '../production-equipment.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'app-view-production-equipment',
    templateUrl: './view-production-equipment.component.html',
    styleUrls: ['./view-production-equipment.component.less']
})
export class ViewProductionEquipmentComponent extends FormTemplateComponent {

    @Input() record;
    detailInfo: any = {};

    constructor(
        private breakpointObserver: BreakpointObserver,
        private pes: ProductionEquipmentService,
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
        this.pes.detail(this.key).then((data) => {
            this.detailInfo = data;
        });
    }

    close(): void {
        this.submiting = false;
        this.avatar = null
        this.visible = false
    }
}
