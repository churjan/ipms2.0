import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { LayoutStructureManagementService } from '../../layout-structure-management.service';

import { AppService } from '~/shared/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-tablet-module-setting',
    templateUrl: './tablet-module-setting.component.html',
    styleUrls: ['./tablet-module-setting.component.less'],
})
export class TabletModuleSettingComponent implements OnInit, OnChanges {
    @Input() blst_key;
    @Input() key;

    tabletList: any[] = [];

    constructor(
        private lsms: LayoutStructureManagementService,
        private appService: AppService,
        private message: NzMessageService
    ) {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.key.currentValue) {
            this.fetchTabletList();
        } else {
            this.tabletList = [];
        }
    }

    fetchTabletList() {
        this.lsms.fetchTabletList().then((data: any) => {
            this.lsms.fetchSelectedTabletList(this.key).then((data2: any) => {
                data.forEach((item) => {
                    const flag=data2.find((item2) => item2.module === item.code)
                    if (flag) {
                        item.checked = true;
                        item.key=flag.key
                    } else {
                        item.checked = false;
                    }
                });
            });
            this.tabletList = data;
        });
    }

    onCheckChange(item) {
        if (item.checked) {
            const params = {
                bls_key: this.key,
                module: item.code,
            };
            this.lsms.addTabletList(params).then(() => {
                this.message.success(
                    this.appService.translate('sucess.s_set')
                );
                this.fetchTabletList()
            });
        }else{
            const params =[
                {
                    key: item.key,
                }
            ]
            this.lsms.deleteTabletList(params).then(() => {
                this.message.success(
                    this.appService.translate('sucess.s_set')
                );
                this.fetchTabletList()
            });
        }
    }
}
