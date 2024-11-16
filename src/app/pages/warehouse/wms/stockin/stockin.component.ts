import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StockInService } from '~/pages/warehouse/wms/stockin/stockIn.service';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { DetailComponent } from './detail/detail.component';

@Component({
    selector: 'app-stockin',
    templateUrl: './stockin.component.html',
    styleUrls: ['./stockin.component.less']
})
export class StockinComponent extends ListTemplateComponent {

    constructor(public router: Router,
        public stockInService: StockInService
    ) {
        super();
        this.modularInit("wmsStockin");
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
