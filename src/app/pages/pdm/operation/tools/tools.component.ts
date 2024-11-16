import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '~/pages/hr/employee/employee.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppService } from '~/shared/services/app.service';
import { CommonService } from '~/shared/services/http/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as moment from 'moment';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { TransferChange, TransferItem } from 'ng-zorro-antd/transfer';

@Component({
    selector: 'tools',
    templateUrl: './tools.component.html',
    styleUrls: ['./tools.component.less']
})
export class ToolsComponent extends FormTemplateComponent {
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver
    ) { super() }

    @Output() editDone = new EventEmitter<boolean>()
    list: TransferItem[] = [];
    machines: TransferItem[] = [];
    $asTransferItems = (data: unknown): any[] => { return data as any[] };
    disabled = false;
    showSearch = false;

    ngOnInit(): void {
        this.otherUrl = this.modular.otherUrl;
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
    }

    async open(record: any) {
        this.title = record.node ? this._appService.translate("btn.update") : this._appService.translate("btn.add");
        this.list = new Array();
        this._service.comList('MachineDeviceInfo', {}, 'GetList').then((result) => {
            result.forEach(v => { v.checked = false; v.direction = 'left'; });
            this.list = this.list.concat(result)
        })
        if (record.node) {
            this.key = record.node.key
            if (this.key) {
                this.getData()
            }
        } else {
            this.key = null
        }
        this.visible = true
    }
    getData(): void {
        this._service.comList('OperationMachineDeviceRelation', { poi_key: this.key }, 'GetList').then((response: any) => {
            response.forEach(v => {
                v.checked = false;
                v.direction = 'right';
                this.list = this.list.filter(l => l.key != v.dmdi_key);
            });
            this.list = this.list.filter(l => l.direction == 'left')
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
        let model = new Array();
        let namel = new Array();
        let reduction = new Array();
        if (ret.to === 'left') {
            ret.list.forEach(f => {
                model.push(f)
                namel.push(f.machinename)
                this.list = this.list.filter(l => l.key != f.key)
                reduction.push({ key: f.dmdi_key, code: f.dmdi_code, name: f.dmdi_name, direction: 'left', checked: false })
            })
            this.Confirm('confirm.confirm_deln', namel.join(","), (backcall) => {
                if (backcall == 'pass') {
                    this._service.deleteModel(this.otherUrl.toolurl, model, (data) => {
                        this.message.success(this.getTipsMsg('sucess.s_delete'))
                        this.list = this.list.concat(reduction)
                        this.getData();
                    });
                } else {
                    model.forEach(m => m.direction = 'right')
                    this.list = this.list.concat(model)
                }
            })
        } else if (ret.to === 'right') {
            ret.list.forEach(f => {
                model.push({
                    dmdi_key: f.key,
                    machinename: f.name,
                    poi_key: this.key,
                    // poi_name: this.operation.name,
                    display: true,
                })
            })
            super.save({ url: 'admin/OperationMachineDeviceRelation/Extend/Batch', model: model }, r => {
                // this.message.success(this.getTipsMsg('sucess.s_set'))
                this.getData();
            });
        }
    }

    close(): void {
        this.avatar = null
        this.visible = false
    }


}
