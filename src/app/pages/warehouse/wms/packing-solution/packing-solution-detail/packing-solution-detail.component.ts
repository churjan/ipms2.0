import { Component, OnInit, ViewChild } from '@angular/core';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { PackingSolutionService } from '../packing-solution.service';

@Component({
    selector: 'app-packing-solution-detail',
    templateUrl: './packing-solution-detail.component.html',
    styleUrls: ['./packing-solution-detail.component.less'],
})
export class PackingSolutionDetailComponent extends FormTemplateComponent {
    @ViewChild('crud', { static: false }) crud;
    @ViewChild('printModal', { static: false }) printModal;
    record = null;
    searchValue = '';
    requiredParams = null;
    boxList = [];

    constructor(private pss: PackingSolutionService) {
        super();
    }

    ngOnInit(): void {
        this.columns = this.modular.displayedColumns;
    }

    async open(record) {
        this.record = record;
        this.title = this._appService.translate('btn.' + record.title);
        this.visible = true;

        this.requiredParams = {
            zhuangxinfenzu: this.record.node.key,
        };
        // 获取箱子列表
        this.fetchBoxList();
    }

    fetchBoxList() {
        this.pss.fetchBoxList({ zhuangxinfenzu: this.record.node.key }).then((res: any[]) => {
            this.boxList = res.map((item) => ({
                ...item,
                title: item.expr1,
                isLeaf: true,
            }));

            // 获取衣服条码列表
            setTimeout(() => {
                this.crud.Search();
            }, 0);
        });
    }

    nzItemClick(item) {
        this.requiredParams = {
            zhuangxinfenzu: this.record.node.key,
            ...(item.keys.length && { expr1: item.node.origin.title }),
        };
        setTimeout(()=>{
            this.crud.Search();
        },0)
    }

    onReset() {
        this.searchValue = '';
        this.requiredParams = {
            zhuangxinfenzu: this.record.node.key,
        };
        this.fetchBoxList();
    }

    close(): void {
        this.searchValue = '';
        this.boxList = [];
        this.visible = false;
    }

    // 确认缺件
    onConfirm(record) {
        this.pss.confirmLackPart({ key: record.key }).then(() => {
            this.message.success(this.getTipsMsg('sucess.s_action'));
            this.crud.Search();
        });
    }

    onPrintSuit(item) {
        this.printModal.open({
            title: '打印不干胶',
            type: 'suit',
            item,
        });
    }

    onPrintBox(e, item) {
        e.stopPropagation();
        item = {
            ...item,
            zhuangxinfenzu: this.record.node.key,
        };
        this.printModal.open({
            title: '打印箱贴',
            type: 'box',
            item,
        });
    }
}
