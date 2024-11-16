import { Component, OnInit } from '@angular/core';
import { StockOutService } from '~/pages/warehouse/wms/stockout/stockOut.service';
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
        public stockOutService: StockOutService
    ) { super(); }

    ngOnInit() {
        this.tableColumns = this.stockOutService.detailTableColumns()
    }

    open(record: any): void {
        this.title = record.node.code
        this.queryParams = { wwom_key: record.node.key }
        this.visible = true
    }


    close(): void {
        this.visible = false
    }
}
