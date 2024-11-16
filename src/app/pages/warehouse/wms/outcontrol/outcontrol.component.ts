import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OutControlService } from '~/pages/warehouse/wms/outcontrol/outControl.service';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';

@Component({
    selector: 'app-outcontrol',
    templateUrl: './outcontrol.component.html',
    styleUrls: ['./outcontrol.component.less']
})
export class OutControlComponent extends ListTemplateComponent {

    tableColumns: any[] = []

    constructor(
        public outControlService: OutControlService,
        public router: Router,
    ) {
        super()
        this.modularInit("wmsOutcontrol");
    }

    ngOnInit() {
        this.tableColumns = this.outControlService.tableColumns()
    }
}
