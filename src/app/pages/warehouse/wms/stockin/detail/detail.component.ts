import { Component, OnInit } from '@angular/core';
import { StockInService } from '~/pages/warehouse/wms/stockin/stockIn.service';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';

@Component({
    selector: 'detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.less']
})
export class DetailComponent extends FormTemplateComponent {

    title: string = null
    visible: boolean = false
    queryParams: any = {}
    tableColumns: any[] = []

    constructor(
        public stockInService: StockInService
    ) { super(); }

    ngOnInit() {
        this.tableColumns = this.stockInService.detailTableColumns()
    }

    open(record: any): void {
        this.title = record.node.code
        this.queryParams = { wwim_key: record.node.key }
        this.visible = true
    }


    close(): void {
        this.visible = false
    }
}
