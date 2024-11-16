import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

import { LayoutStructureManagementService } from '../../layout-structure-management.service';
@Component({
    selector: 'app-layout-structure-management-detail',
    templateUrl: './layout-structure-management-detail.component.html',
    styleUrls: ['./layout-structure-management-detail.component.less'],
})
export class LayoutStructureManagementDetailComponent
    implements OnInit, OnChanges
{
    @Input() key;

    detailInfo;

    constructor(private lsms: LayoutStructureManagementService) {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.key.currentValue) {
            this.fetchList();
        } else {
            this.detailInfo = null;
        }
    }

    fetchList() {
        this.lsms.detail(this.key).then((data) => {
            this.detailInfo = data;
        });
    }
}
