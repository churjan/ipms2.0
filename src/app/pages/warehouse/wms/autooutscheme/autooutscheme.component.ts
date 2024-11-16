import { Component, OnInit } from '@angular/core';
import { AutoOutSchemeService } from '~/pages/warehouse/wms/autooutscheme/autoOutScheme.service';

@Component({
  selector: 'app-autooutscheme',
  templateUrl: './autooutscheme.component.html',
  styleUrls: ['./autooutscheme.component.less']
})
export class AutooutschemeComponent implements OnInit {

    tableColumns: any[] = []

    constructor(
        public autoOutSchemeService: AutoOutSchemeService,
    ) {}

    ngOnInit(){
        this.tableColumns = this.autoOutSchemeService.tableColumns()
    }
}
