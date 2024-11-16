import { Component, OnInit, OnDestroy } from '@angular/core';
import { LayoutStructureManagementService } from '../layout-structure-management.service';

@Component({
    selector: 'app-layout-structure-management-table-list',
    templateUrl: './layout-structure-management-table-list.component.html',
    styleUrls: ['./layout-structure-management-table-list.component.less'],
})
export class LayoutStructureManagementTableListComponent
    implements OnInit, OnDestroy {
    catalogChange$;
    catalogItem: any = {};
    tabIndex = 0;
    sub = false;
    sku = false;

    constructor(private lsms: LayoutStructureManagementService) { }

    ngOnInit(): void {
        this.catalogChange$ = this.lsms.catalogChange$.subscribe(
            (catalogItem) => {
                this.catalogItem = catalogItem;
                if (catalogItem.group === 'Station') {
                    this.sub = true;
                }
                if (catalogItem.group === 'In') {
                    this.sku = true;
                    this.sub = false;
                }
            }
        );
    }

    ngOnDestroy(): void {
        this.catalogChange$.unsubscribe();
    }
}
