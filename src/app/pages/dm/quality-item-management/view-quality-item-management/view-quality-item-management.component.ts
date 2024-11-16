import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { EmbedModalService } from '~/shared/components/embed-modal/embed-modal.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { QualityItemManagementService } from '../quality-item-management.service';
@Component({
    selector: 'app-view-quality-item-management',
    templateUrl: './view-quality-item-management.component.html',
    styleUrls: ['./view-quality-item-management.component.less']
})
export class ViewQualityItemManagementComponent extends FormTemplateComponent {

    @Input() record;
    detailInfo: any = {};
    tableSelectedList: any[] = []
    y = 'calc(100vh -300px)';
    @Output() editDone = new EventEmitter<boolean>()

    constructor(
        private breakpointObserver: BreakpointObserver,
        private qims: QualityItemManagementService,
        private ems: EmbedModalService
    ) {
        super()
    }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '40rem'
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
                this.fetchDetail();
                this.fetchSelectedList()
            }
        } else {
            this.key = null
        }
        this.visible = true
    }

    fetchDetail() {
        this.qims.detail(this.key).then((data) => {
            this.detailInfo = data;
        });
    }


    fetchSelectedList() {
        this.qims
            .fetchSelectedOperationList(this.key)
            .then((data: any) => {
                this.tableSelectedList = data;
            });
    }

    close(): void {
        this.submiting = false;
        this.avatar = null
        this.visible = false
    }

}
