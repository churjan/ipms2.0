import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import * as moment from 'moment';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';
import { UtilService } from '~/shared/services/util.service';

@Component({
    selector: 'InventoryEdit',
    templateUrl: './InventoryEdit.component.html',
    styleUrls: ['./InventoryEdit.component.less']
})
export class InventoryEditComponent extends FormTemplateComponent {

    @Output() editDone = new EventEmitter<boolean>()
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', child: 'sonlist', url: 'LayoutStructure/extend' }
    body = { maketree: true, moduletype: 103 };
    rawdata: any = new Array();
    count = { time: 0, key: '' };
    isPreview: boolean = false;
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
    ) {
        super()
        this.modularInit("whOutofstock");
    }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '800px'
            } else {
                this.width = '100%'
            }
        })
        this.validateForm = this.fb.group({
            key: [null],
            code: [UtilService.dateFormat(new Date(), 'yyyyMMddHHmmssfff'), [Validators.required]],
            hei_key: [null],
            remark: [null],
            wwod_list: [[]],
            create_hei_key: [sessionStorage.userkey],
            create_hei_name: [sessionStorage.username],
            create_time: [UtilService.dateFormat(new Date())],
            state: [0],
            state_name: [this.getTipsMsg('placard.new_built')]
        })
    }

    async open(record: any) {
        this.title = this._appService.translate("placard." + record.title);
        this.rawdata = record.rawdata
        if (record.node && record.node.key) {
            this.key = record.node.key
            this.count = { time: 0, key: '' };
            this.validateForm.patchValue(record.node)
        } else {
            this.key = null;
            this.validateForm.patchValue(record.node)
        }
        this.visible = true
    }
    allout(ev) {
        const that = this;
        if (ev) {
            let key = ev.key;
            if (ev.blst_key == '10'||ev.group=='Line') {
                this.message.error(this.getTipsMsg('checkdata.check_outstation'));
                return;
            }
            if (ev.blst_key == '1010'||ev.group=='Station') {
                if (ev.sonlist && ev.sonlist.length > 0) {
                    key = ev.sonlist[0].key;
                } else {
                    this.message.error(this.getTipsMsg('checkdata.confirm_layoutcorrect'));
                    return;
                }
            }
            this.Confirm('confirm.confirm_Manual', '', (confirmType) => {
                if (confirmType == 'pass') {
                    let wwod = this.validateForm.get('wwod_list').value
                    wwod.forEach(element => {
                        element.out_bls_key = key;
                    });
                    this.validateForm.patchValue({ wwod_list: wwod })
                }
            })
        }
    }
    selectout_bls(ev, item) {
        if (ev) {
            if (ev.blst_key == '10'||ev.group=='Line') {
                this.message.error(this.getTipsMsg('checkdata.check_outstation'));
                return;
            }
        }
    }
    delDetail(data, num) {
        if (data) { data.splice(num) }
    }
    submitForm(event?: KeyboardEvent) {
        if (this.submiting) return false
        if (!event || event.key == "Enter") {
            let model: any = {}
            this.submit();
            if (this.validateForm.status == 'VALID') {
                model = Object.assign({}, this.model, this.validateForm.value);
            } else { this.submiting = false; return }
            this.submiting = true;
            super.save({ model: model }, () => {
                this.submiting = false;
                this.editDone.emit(true)
                this.close();
            });
        }
    }
    close(): void {
        this.validateForm.reset();
        this.avatar = null
        this.visible = false
    }


}
