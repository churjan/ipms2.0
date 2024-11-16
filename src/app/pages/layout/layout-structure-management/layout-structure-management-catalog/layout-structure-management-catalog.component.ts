import { Component, OnInit, OnDestroy } from '@angular/core';
import { LayoutStructureManagementService } from '../layout-structure-management.service';

import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { AppService } from '~/shared/services/app.service';
import { EmbedModalService } from '~/shared/components/embed-modal/embed-modal.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-layout-structure-management-catalog',
    templateUrl: './layout-structure-management-catalog.component.html',
    styleUrls: ['./layout-structure-management-catalog.component.less'],
})
export class LayoutStructureManagementCatalogComponent
    implements OnInit, OnDestroy
{
    searchValue = '';
    nodes = [];

    modalClose$;
    isShowEditModal;
    isShowCapacityEditModal;
    constructor(
        private lsms: LayoutStructureManagementService,
        public appService: AppService,
        private message: NzMessageService,
        private modal: NzModalService,
        private ems: EmbedModalService
    ) {}

    ngOnInit(): void {
        this.fetchCatalog();

        this.modalClose$ = this.ems.modalClose$.subscribe((data) => {
            if (data.type === 'app-edit-layout-structure-management-catalog') {
                this.isShowEditModal = false;
            }
        });
    }

    ngOnDestroy(): void {
        this.modalClose$.unsubscribe();
    }

    fetchCatalog() {
        this.lsms.fetchCatalog().then((data: any) => {
            data.forEach((item) => (item.pkey = item.pkey ?? ''));
            this.nodes = this.recursion(data, '');
        });
    }

    recursion(data, pkey) {
        const filterData = data.filter((item) => item.pkey === pkey);
        if (filterData) {
            filterData.forEach((item) => {
                item.title = item.title = `${item.name}[${item.code}]`;
                item.children = this.recursion(data, item.key);
                item.isLeaf = !item.children.length;
            });
        }
        return filterData;
    }

    nzEvent(event: NzFormatEmitEvent): void {
        if (event.keys.length) {
            this.lsms.catalogChange$.next(event.node.origin);
        } else {
            this.lsms.catalogChange$.next({});
        }
    }

    onReload() {
        this.modal.confirm({
            nzTitle: `${this.appService.translate(
                'confirm.confirm_Synchronous'
            )}`,
            nzOnOk: () => {
                const msgId = this.message.loading(
                    this.appService.translate('placard.loading'),
                    { nzDuration: 0 }
                ).messageId;
                this.lsms
                    .reload()
                    .then(() => {
                        this.message.success(
                            this.appService.translate('sucess.s_syn')
                        );
                        this.fetchCatalog();
                    })
                    .finally(() => {
                        this.message.remove(msgId);
                    });
            },
        });
    }

    onEdit() {
        this.isShowEditModal = true;
    }

    onCapacity(){
        this.isShowCapacityEditModal = true;
    }
}
