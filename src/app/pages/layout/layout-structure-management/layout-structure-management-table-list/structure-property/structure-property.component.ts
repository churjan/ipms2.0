import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { LayoutStructureManagementService } from '../../layout-structure-management.service';

@Component({
    selector: 'app-structure-property',
    templateUrl: './structure-property.component.html',
    styleUrls: ['./structure-property.component.less'],
})
export class StructurePropertyComponent implements OnInit, OnChanges {
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
            this.attrList = data.blsav_list;
            // this.skuList = data.bsia;
        });
    }
}
