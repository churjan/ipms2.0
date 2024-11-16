import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '~/shared/services/http/common.service';
import { StatisticsinService } from '~/pages/warehouse/wms/statisticsin/statisticsin.service';
import { SyncComponent } from './sync/sync.component';

@Component({
    selector: 'app-statisticsin',
    templateUrl: './statisticsin.component.html',
    styleUrls: ['./statisticsin.component.less']
})
export class StatisticsinComponent implements OnInit {

    @ViewChild('statisticsinsync') StatisticsInSyncEle: SyncComponent

    tableColumns: any[] = []

    constructor(
        public statisticsinService: StatisticsinService,
        private commonService: CommonService
    ) { }

    async ngOnInit() {
        await this.commonService.getTableHeader().then((response: any) =>{
            this.tableColumns = this.statisticsinService.tableColumns(response)
        })
    }

    openInSync(){
        this.StatisticsInSyncEle.open()
    }
}
