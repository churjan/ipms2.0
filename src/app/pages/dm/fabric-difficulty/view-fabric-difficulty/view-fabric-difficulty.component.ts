import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '~/shared/services/app.service';
import { EmbedModalService } from '~/shared/components/embed-modal/embed-modal.service';
import { FabricDifficultyService } from '../fabric-difficulty.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
@Component({
    selector: 'app-view-fabric-difficulty',
    templateUrl: './view-fabric-difficulty.component.html',
    styleUrls: ['./view-fabric-difficulty.component.less'],
})
export class ViewFabricDifficultyComponent extends FormTemplateComponent  {
    detailInfo: any = {};

    constructor(
        private breakpointObserver: BreakpointObserver,
        private fds: FabricDifficultyService,
        private ems: EmbedModalService
    ) {super() }

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
        this.fds.detail(this.key).then((data) => {
            this.detailInfo = data;
        });
    }
    close(): void {
        this.submiting = false;
        this.avatar = null
        this.visible = false
    }
}
