import { Component, OnInit } from '@angular/core';
import { ProgrammeService } from '~/shared/services/http/programme.service';

@Component({
    selector: 'stations',
    templateUrl: './stations.component.html',
    styleUrls: ['./stations.component.less']
})
export class StationsComponent implements OnInit {

    title: string = null
    visible: boolean = false
    queryParams: any = {}
    loading: boolean = false
    data: any[] = []
    tableColumns: any[] = []

    constructor(
        public programmeService: ProgrammeService
    ) { }

    ngOnInit(){
        this.tableColumns = this.programmeService.stationTableColumns()
    }

    open(record: any): void {
        this.title = record.name
        this.queryParams = {bssi_key: record.key}
        this.loadDataFromServer()
        this.visible = true
    }

    loadDataFromServer(): void {
        this.loading = true
        this.programmeService.stations(this.queryParams).then((response: any[]) => {
            this.data = response
        }).finally(() =>{
            this.loading = false
        })
    }

    close(): void {
        this.visible = false
    }
}
