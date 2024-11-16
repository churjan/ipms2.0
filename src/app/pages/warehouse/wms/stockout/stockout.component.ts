import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StockOutService } from '~/pages/warehouse/wms/stockout/stockOut.service';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { DetailComponent } from './detail/detail.component';

@Component({
    selector: 'app-stockout',
    templateUrl: './stockout.component.html',
    styleUrls: ['./stockout.component.less']
})
export class StockoutComponent extends ListTemplateComponent {

    constructor(public router: Router,
        public stockOutService: StockOutService
    ) {
        super();
        this.modularInit("wmsStockout");
        this.url = router.url.replace(/\//g, "_")
        if (this.url.indexOf("_") == 0) {
            this.url = this.url.substring(1, this.url.length)
        }
    }
    @ViewChild('detail', { static: false }) detail: DetailComponent;
    btnEvent(event) {
        switch (event.action) {
            case 'view':
                this.detail.open({ title: 'see', node: event.node })
                return;
        }
        super.btnEvent(event);
    }

}
