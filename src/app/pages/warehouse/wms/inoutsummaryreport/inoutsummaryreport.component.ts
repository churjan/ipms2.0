import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '~/shared/services/http/common.service';
import { UtilService } from '~/shared/services/util.service';
import { CrudComponent } from '~/shared/components/crud/crud.component';
import { FilterComponent } from './filter/filter.component';
import { InoutsummaryreportService } from '~/pages/warehouse/wms/inoutsummaryreport/inoutsummaryreport.service';

@Component({
  selector: 'app-inoutsummaryreport',
  templateUrl: './inoutsummaryreport.component.html',
  styleUrls: ['./inoutsummaryreport.component.less']
})
export class InoutsummaryreportComponent implements OnInit {

  @ViewChild('crud') crud: CrudComponent
  @ViewChild('filter') filter: FilterComponent
  tableColumns: any[] = []
  filterFilds: any[] = []

  constructor(
    private commonService: CommonService,
    private utilService: UtilService,
    public inoutsummaryreportService:InoutsummaryreportService
  ) { }

      async ngOnInit() {
        await  this.commonService.systemParameter('InOutSummaryReportDisplayField').then((response: any) =>{
          if(response){
            this.filterFilds= JSON.parse(response)
            this.tableColumns = this.inoutsummaryreportService.tableColumns(JSON.parse(response),false,true)
          }
      })
  }

  advancedSearch($event){
    const queryParams= $event
    const DateMode=queryParams.DateMode
    const showFilds=this.filterFilds
    let IsShowDate=false
    let IsShowOnnum=true
    switch (DateMode){
      case '1':
      case '2':
        IsShowDate=true
        IsShowOnnum=false
    }
  
    this.tableColumns = this.inoutsummaryreportService.tableColumns(this.filterFilds,IsShowDate,IsShowOnnum)
    this.crud.advancedSearch($event)
  }
  reset(){
    this.tableColumns = this.inoutsummaryreportService.tableColumns(this.filterFilds,false,true)
    this.filter.reset()
  }
}