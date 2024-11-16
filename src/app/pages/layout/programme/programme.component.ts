import { Component, OnInit } from '@angular/core';

import { PositionTransferComponent } from './position-transfer/position-transfer.component';

import { AppService } from '~/shared/services/app.service';
import { ProgrammeService } from '~/shared/services/http/programme.service';

import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-programme',
    templateUrl: './programme.component.html',
    styleUrls: ['./programme.component.less']
})
export class ProgrammeComponent implements OnInit {

    tableColumns: any[] = []

    constructor(
        public programmeService: ProgrammeService,
        private modal: NzModalService,
        private appService :AppService
    ) { }

    ngOnInit(): void {
        this.tableColumns = this.programmeService.tableColumns()
    }

    onShowPositionTransferModal(record) {
        const modal = this.modal.create({
          nzTitle: this.appService.translate("programme.stationAllocation"),
          nzWidth:'1000px',
          nzComponentParams:{
              record
          },
          nzContent: PositionTransferComponent,
          nzFooter:null
        });
      
        modal.afterClose.subscribe((bool: boolean) => {
          if (bool) {
          }
        });
    }
}
