import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '~/pages/hr/employee/employee.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AppService } from '~/shared/services/app.service';
import { CommonService } from '~/shared/services/http/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as moment from 'moment';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { UtilService } from '~/shared/services/util.service';
import { TransferChange, TransferItem } from 'ng-zorro-antd/transfer';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.less']
})
export class EditComponent extends FormTemplateComponent {

    @Output() editDone = new EventEmitter<boolean>()
    title: string
    width: string
    visible: boolean = false
    validateForm!: FormGroup
    submiting: boolean = false
    avatar: string
    key: string
    list: any[] = [];
    $asTransferItems = (data: unknown): any[] => data as any[];
    constructor(
        private breakpointObserver: BreakpointObserver,
        public commonService: CommonService
    ) { super(); }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
        this._service.comList('PartInfo', {}, 'GetList').then((result) => {
            result.forEach(v => { v.checked = false; v.direction = 'left'; this.list.push(v) });
        })
    }

    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        if (record.node) {
            this.key = record.node.key;
            this.getData();
        } else {
            this.key = null;
        }
        this.visible = true
    }
    getData(): void {
        this._service.comList('OperationPartRelation', { poi_key: this.key }, 'getlist').then((response: any) => {
            response.forEach(v => { v.checked = false; v.direction = 'right'; });
            this.list = this.list.concat(response)
        })
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
                namel.push(f.bpi_name)
            })
            this.Confirm('confirm.confirm_deln', namel.join(","), (backcall) => {
                if (backcall == 'pass') {
                    model.forEach(f => {
                        let Index = this.list.findIndex(l => l.key == f.key);
                        this.list[Index] = {
                            key: f.bpi_key,
                            name: f.bpi_name,
                            code: f.bpi_code,
                            poi_key: this.key,
                            direction: 'left',
                            checked: false,
                            hide: false
                        }
                    })
                    // this._service.deleteModel(this.otherUrl.toolurl, model, (data) => {
                    //     this.message.success(this.getTipsMsg('sucess.s_delete'))
                    //     this.getData();
                    // });
                }
            })
        } else if (ret.to === 'right') {
            let OperationPartRelation = new Array();
            ret.list.forEach(f => {
                let Index = this.list.findIndex(l => l.key == f.key);
                this.list[Index] = Object.assign(this.list[Index], {
                    key: '',
                    bpi_key: f.key,
                    bpi_name: f.name,
                    bpi_code: f.code,
                    poi_key: this.key,
                    direction: 'right'
                })
            })
            // this._service.saveModel(this.otherUrl.pariurl + 'Extend/BatchSave/', 'post', OperationPartRelation, (s) => {
            //     this.getData();
            // })
        }
    }

    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false
        if (UtilService.isEmpty(this.key) == true) {
            this.message.error(this.getTipsMsg('checkdata.check_xx', this.getTipsMsg('pdmPartoperation.poi_key')))
            return
        }
        if (!event || event.key == "Enter") {
            let OperationPartRelation = new Array();
            this.list.forEach(f => {
                if (f.direction == 'right')
                    OperationPartRelation.push({
                        bpi_key: f.bpi_key ? f.bpi_key : f.key,
                        bpi_name: f.name ? f.name : f.bpi_name,
                        bpi_code: f.code ? f.code : f.bpi_code,
                        poi_key: this.key
                    })
            })
            this.submiting = true
            super.save({ model: OperationPartRelation }, (v) => {
                this.key = v.key
                this.submiting = false;
            });
        }
    }

    close(): void {
        this.avatar = null
        this.visible = false;
        this.editDone.emit(false);
    }


}
