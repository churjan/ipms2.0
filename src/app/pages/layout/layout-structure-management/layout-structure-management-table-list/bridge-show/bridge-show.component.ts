import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { LayoutStructureManagementService } from '../../layout-structure-management.service';

@Component({
    selector: 'app-bridge-show',
    templateUrl: './bridge-show.component.html',
    styleUrls: ['./bridge-show.component.less'],
})
export class BridgeShowComponent implements OnInit, OnChanges {
    @Input() key;
    bridgeList: any[] = [];
    y = 'calc(100vh - 427px)';

    constructor(private lsms: LayoutStructureManagementService) {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.key.currentValue) {
            this.fetchList();
        } else {
            this.bridgeList = [];
        }
    }

    fetchList() {
        this.lsms.fetchBridgeInfo(this.key).then((data: any) => {
            this.bridgeList = data;
        });
    }
}
