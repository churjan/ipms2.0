import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '~/shared/services/http/common.service';
import { StatisticsoutService } from '~/pages/warehouse/wms/statisticsout/statisticsout.service';
import { SyncComponent } from './sync/sync.component';

@Component({
    selector: 'app-statisticsout',
    templateUrl: './statisticsout.component.html',
    styleUrls: ['./statisticsout.component.less']
})
export class StatisticsoutComponent implements OnInit {

    @ViewChild('statisticsoutsync') StatisticsOutSyncEle: SyncComponent

    tableColumns: any[] = []

    constructor(
        public statisticsoutService: StatisticsoutService,
        private commonService: CommonService
    ) { }

    async ngOnInit() {
        await this.commonService.getTableHeader().then((response: any) =>{
            this.tableColumns = this.statisticsoutService.tableColumns(response)
        })
    }

    openOutSync(){
        this.StatisticsOutSyncEle.open()
    }

}
