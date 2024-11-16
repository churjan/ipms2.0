import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { LayoutStructureManagementService } from '../../layout-structure-management.service';

@Component({
    selector: 'app-sra',
    templateUrl: './sra.component.html',
    styleUrls: ['./sra.component.less'],
})
export class SraComponent implements OnInit, OnChanges {
    @Input() key;
    attrList: any[] = [];
    skuList: any = {};
    constructor(private lsms: LayoutStructureManagementService) { }

    ngOnInit(): void { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.key.currentValue) {
            this.fetchList();
        } else {
            this.attrList = [];
        }
    }

    fetchList() {
        this.lsms.detail(this.key).then((data: any) => {
            this.skuList = data.bsia;
        });
    }
}
