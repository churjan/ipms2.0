import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { CrudComponent } from '~/shared/common/crud/crud.component';

@Component({
    selector: 'app-inventory-clearance-management',
    templateUrl: './inventory-clearance-management.component.html',
    styleUrls: ['./inventory-clearance-management.component.less'],
})
export class InventoryClearanceManagementComponent extends ListTemplateComponent {
    @ViewChild('crud') crud: CrudComponent

    constructor(public router: Router) {
        super();
        this.modularInit('wmsInventoryclearancemanagement');
        this.url = router.url.replace(/^\//, '').replace(/\//g, '_');
    }

    btnEvent(event) {
        super.btnEvent(event);
    }

    selectCategory(ev) {
        if (ev) { this.crud.SearchModel.bls_key = ev.key; } else {
            this.crud.SearchModel.bls_key = '';
        }
        this.crud.Search()
    }
}
