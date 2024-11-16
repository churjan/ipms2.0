import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '~/shared/services/app.service';
import { EmbedModalService } from '~/shared/components/embed-modal/embed-modal.service';
import { StructureRuleParamService } from '../../structure-rule-param.service';
@Component({
    selector: 'app-view-structure-rule-param',
    templateUrl: './view-structure-rule-param.component.html',
    styleUrls: ['./view-structure-rule-param.component.less'],
})
export class ViewStructureRuleParamComponent implements OnInit {
    @Input() record;
    detailInfo: any = {};

    constructor(
        private appService: AppService,
        private srps: StructureRuleParamService,
        private ems: EmbedModalService
    ) {}

    ngOnInit(): void {
        if (this.record) {
            this.srps.detail(this.record.key).then((data: any) => {
                if (['customselect'].includes(data.optionmode)) {
                    data.optionvalue = JSON.stringify(JSON.parse(data.optionvalue || {}), null, '\t');
                } else if (
                    ['input', 'judgment-input'].includes(data.optionmode)
                ) {
                    data.optionvalue = data.inputtype;
                }

                this.detailInfo = data;
            });
        }
    }
}
