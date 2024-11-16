import { Component,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
@Component({
    selector: 'app-price-info',
    templateUrl: './price-info.component.html',
    styleUrls: ['./price-info.component.less'],
})
export class PriceInfoComponent extends ListTemplateComponent {
    @ViewChild('edit') editRef;

    constructor(
        public router: Router,
    ) {
        super();
        this.modularInit('wmsPriceinfo');
        this.url = router.url.replace(/^\//, '').replace(/\//g, '_');
    }

    ngOnInit(): void {}

    btnEvent(event) {
        super.btnEvent(event);
    }

    openModal(model: any) {
        this.editRef.open(model)
    }
}
