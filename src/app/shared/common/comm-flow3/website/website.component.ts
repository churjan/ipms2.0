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
    selector: 'website',
    templateUrl: './website.component.html',
    styleUrls: ['./website.component.less']
})
export class WebsiteComponent extends FormTemplateComponent {

    @Output() editDone = new EventEmitter<boolean>()
    @Output() onEdit = new EventEmitter();
    list: TransferItem[] = [];
    Operation: TransferItem[] = [];
    $asTransferItems = (data: unknown): any[] => data as any[];
    mixtureratio = 0;
    searchTxt: string = '';
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'code', url: 'LayoutStructure/extend' }
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver
    ) { super(); this.modularInit("pdmOperation"); }

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
        this.title = this._appService.translate("btn." + record.title);
        this.list = new Array();
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
        this._service.comList('OperationStructureRelation', { poi_key: this.key }, 'GetList').then((response: any) => {
            this.list = this.list.filter(l => l.direction == 'left')
            response.forEach(v => {
                v.checked = false;
                v.direction = 'right'
                this.list = this.list.filter(l => l.key != v.bls_key);
            });
            this.list = this.list.concat(response)
        })
    }
    search(event) {
        if (event.group != "Station") {
            event.sonlist.forEach(e => { e.chk = true; e.checked = false; e.direction = 'left' });
            this.list = this.list.filter(l => l.direction == 'right')
            this.list = this.list.concat(event.sonlist)
        } else { event.chk = true; this.list = [event]; }
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
                reduction.push({ key: f.bls_key, code: f.bls_code, name: f.bls_name, mixtureratio: f.mixtureratio, direction: 'left', checked: false })
            })
            this.Confirm('confirm.confirm_deln', namel.join(","), (backcall) => {
                if (backcall == 'pass') {
                    this._service.deleteModel(this.otherUrl.website, model, (data) => {
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
                    poi_key: this.key,
                    bls_key: f.key,
                    mixtureratio: f.mixtureratio ? f.mixtureratio : 1,
                    display: true
                })
            })
            super.save({ url: this.otherUrl.batchwebsite, model: model }, r => {
                this.getData();
            });
        }
    }
    skAction(e: any, model: any, type: number) {
        if (e.type === 'blur') {
            if (type === 1 && model.mixtureratio === this.mixtureratio) { return false; }
            this.Confirm('confirm.confirm_cvhb', null, (backcall) => {
                if (backcall == 'pass') { this.saveSkillval(model, type); } else { model.mixtureratio = this.mixtureratio; }
            })
        } else {
            if (e.keyCode !== 13) { return false; }
            this.saveSkillval(model, type);
        }
    }
    cacheVal(model: any, type: number) {
        this.mixtureratio = model.mixtureratio;
    }
    saveSkillval(model: any, type: number) {
        if (model.mixtureratio < 0) {
            this.message.error('warning.mrs');
            return;
        }
        const body: any = {
            key: model.key,
            poi_key: model.poi_key,
            bls_key: model.bls_key,
            mixtureratio: model.mixtureratio
        };
        this._service.saveModel(this.otherUrl.website, "put", body, v => {
            this.message.success(this.getTipsMsg('sucess.s_save'))
            this.mixtureratio = model.mixtureratio;
        }, function (err) {

        });
    }

    close(): void {
        this.avatar = null
        this.visible = false
        this.onEdit.emit({ poi_key: this.key })
    }


}
