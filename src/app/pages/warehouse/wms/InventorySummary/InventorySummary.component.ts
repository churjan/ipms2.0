import { Component, OnInit, ViewChild } from '@angular/core';
import { ListTemplateComponent } from '~/shared/common/base/list-template.component';
import { Router } from '@angular/router';
import { CrudComponent } from '~/shared/common/crud/crud.component';

@Component({
    selector: 'app-InventorySummary',
    templateUrl: './InventorySummary.component.html',
    styleUrls: ['./InventorySummary.component.less']
})
export class InventorySummaryComponent extends ListTemplateComponent {
    @ViewChild('crud') crud: CrudComponent

    queryParams: any = {}
    ready: boolean = false

    constructor(public router: Router) {
        super()
        this.modularInit("wmsInventorySummary",router.url);
    }
    Locationtype = [{ label: 'placard.Within', value: 0, completed: false, disabled: true, checked: true },
    { label: 'placard.Onmain', value: 1, completed: false, disabled: true }]

    async ngOnInit() {
        this.ready = true
    }
}
