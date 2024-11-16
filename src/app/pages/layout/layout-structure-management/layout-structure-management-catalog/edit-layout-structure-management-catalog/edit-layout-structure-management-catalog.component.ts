import { Component, OnInit } from '@angular/core';
import { LayoutStructureManagementService } from '../../layout-structure-management.service';
import { EmbedModalService } from '~/shared/components/embed-modal/embed-modal.service';
import { AppService } from '~/shared/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
    selector: 'app-edit-layout-structure-management-catalog',
    templateUrl: './edit-layout-structure-management-catalog.component.html',
    styleUrls: ['./edit-layout-structure-management-catalog.component.less'],
})
export class EditLayoutStructureManagementCatalogComponent implements OnInit {
    operation = null;
    bpmlist: any[] = [];
    nodes = [];
    isLoading = false;
    blslist: any[] = [];
    y = 'calc(100vh - 595px)';
    constructor(
        private lsms: LayoutStructureManagementService,
        private ems: EmbedModalService,
        private appService: AppService,
        private message: NzMessageService
    ) { }

    ngOnInit(): void {
        this.fetchCatalog();
        this.fetchTabletList();
    }

    fetchCatalog() {
        this.lsms.fetchCatalog().then((data: any) => {
            this.nodes = this.recursion(data, '', 0);
        });
    }
    fetchTabletList() {
        this.lsms.fetchTabletList().then((data: any) => {
            const list: any[] = [];
            data.forEach((item) => {
                list.push({
                    label: item.name,
                    value: item.code,
                    checked: false,
                });
            });
            this.bpmlist = list;
        });
    }

    recursion(data, pkey, level) {
        let filterData = data.filter((item) => item.pkey === pkey);
        if (pkey == '') { filterData = data.filter((item) => item.pkey === pkey || item.pkey === null); }
        if (filterData) {
            filterData.forEach((item) => {
                item.title = `${item.name}[${item.code}]`;
                if (level === 1) {
                    item.children = [];
                } else {
                    item.children = this.recursion(data, item.key, level + 1);
                }
                item.isLeaf = !item.children.length;
            });
        }
        return filterData;
    }

    nzEvent(e: any) {
        if (e.keys.length) {
            if (e.node.origin.children.length) {
                this.blslist = Array.from(
                    new Set([...this.blslist, ...e.node.origin.children])
                );
            } else {
                this.blslist = Array.from(
                    new Set([...this.blslist, e.node.origin])
                );
            }
        }
    }

    onSubmit() {
        if (!this.operation) {
            this.message.warning(this.appService.translate('checkdata.check'));
            return;
        }
        const isFalsy = this.bpmlist.every((item) => !item.checked);
        if (isFalsy) {
            this.message.warning(this.appService.translate('checkdata.check'));
            return;
        }
        if (!this.blslist.length) {
            this.message.warning(this.appService.translate('checkdata.check'));
            return;
        }

        this.isLoading = true;
        const params = {
            operation: this.operation,
            bpmlist: this.bpmlist.reduce(
                (acc, cur) =>
                    cur.checked ? [...acc, { Module: cur.value }] : acc,
                []
            ),
            blslist: this.blslist.map((item) => ({
                key: item.key,
                code: item.code,
                name: item.name,
            })),
        };
        this.lsms
            .setTablet(params)
            .then(() => {
                this.message.success(
                    this.appService.translate('sucess.s_save')
                );
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    onClose() {
        this.ems.modalClose$.next({
            type: 'app-edit-layout-structure-management-catalog',
            bool: false,
        });
    }

    onDelete(i) {
        this.blslist.splice(i, 1);
        this.blslist = [...this.blslist];
    }
}
