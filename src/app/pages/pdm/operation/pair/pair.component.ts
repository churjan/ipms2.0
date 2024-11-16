import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { TransferChange, TransferItem } from 'ng-zorro-antd/transfer';
import { UtilService } from '~/shared/services/util.service';

@Component({
    selector: 'pair',
    templateUrl: './pair.component.html',
    styleUrls: ['./pair.component.less']
})
export class PairComponent extends FormTemplateComponent {

    @Output() editDone = new EventEmitter<boolean>()
    list: any[] = [];
    part: any[] = [];
    $asTransferItems = (data: unknown): any[] => data as any[];
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver
    ) { super() }

    ngOnInit(): void {
        this.otherUrl = this.modular.otherUrl;
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
        this.PartInfo();
    }
    PartInfo() {
        this._service.comList('PartInfo', {}, 'GetList').then((result) => {
            this.list = this.list.filter(r => r.direction != 'left');
            result.forEach(v => { v.checked = false; v.direction = 'left'; this.list.push(v) });
        })
    }
    async open(record: any) {
        this.title = record.node ? this._appService.translate("btn.update") : this._appService.translate("btn.add");
        if (record.node) {
            this.key = record.node.key
            if (this.key) {
                this.getData();
            }
        } else {
            this.key = null
        }
        this.visible = true
    }
    getData(): void {
        this._service.comList('OperationPartRelation', { poi_key: this.key }, 'getlist').then((response: any) => {
            response.forEach(v => {
                v.checked = false; v.direction = 'right';
            });
            this.list = this.list.filter(r => r.direction != 'right');
            this.list = this.list.concat(response)
        })
    }
    reload(direction: string): void {
        this.getData();
        this.message.success(`your clicked ${direction}!`);
    }

    select(ret: {}): void { }

    change(ret: TransferChange): void {
        const listKeys = ret.list.map(l => l.key);
        const hasOwnKey = (e: TransferItem): boolean => e.hasOwnProperty('key');
        if (ret.to === 'left') {
            let model = new Array();
            let namel = new Array();
            ret.list.forEach(f => {
                model.push(f)
                namel.push(f.machinename)
            })
            this.Confirm('confirm.confirm_deln', namel.join(","), (backcall) => {
                if (backcall == 'pass') {
                    this._service.deleteModel(this.otherUrl.pariurl, model, (data) => {
                        this.message.success(this.getTipsMsg('sucess.s_delete'))
                        this.PartInfo();
                        this.getData();
                    });
                }else{
                    this.PartInfo();
                    this.getData();
                }
            })
        } else if (ret.to === 'right') {
            let OperationPartRelation = new Array();
            ret.list.forEach(f => {
                OperationPartRelation.push({
                    bpi_key: f.key,
                    bpi_name: f.name,
                    bpi_code: f.code,
                    poi_key: this.key
                })
            })
            this._service.saveModel(this.otherUrl.pariurl + 'Extend/BatchSave/', 'post', OperationPartRelation, (s) => {
                this.PartInfo();
                this.getData();
            }, err => {
                this.PartInfo();
                this.getData();
            })
        }
    }

    close(): void {
        this.avatar = null
        this.visible = false
    }


}
