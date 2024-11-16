import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import * as moment from 'moment';
import { FormTemplateComponent } from '~/shared/common/base/form-Template.component';

@Component({
    selector: 'edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.less']
})
export class EditComponent extends FormTemplateComponent {

    @Output() editDone = new EventEmitter<boolean>()
    validateForm!: FormGroup
    key: string
    /** */
    setting = { DataFiled: 'key', pKey: 'pkey', DataTxt: 'name', child: 'sonlist', url: 'LayoutStructure/extend' }
    MatchingTree = { maketree: true, moduletype: 13 };
    stationRailtree = { maketree: true, blst_key_list: '101010',BLST_Group:'In', stationtype_list: '1,2,3,12,13,14,15', containparent: true };
    constructor(
        private fb: FormBuilder,
        private breakpointObserver: BreakpointObserver,
    ) { super() }

    ngOnInit(): void {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
            if (!result.matches) {
                this.width = '40%'
            } else {
                this.width = '100%'
            }
        })
        this.validateForm = this.fb.group({
            key: [null, [Validators.required]],
            pair_bls_key: [null, [Validators.required]],
        })
    }

    async open(record: any) {
        this.title = this._appService.translate("btn." + record.title)
        if (record.node && record.node.key) {
            this.key = record.node.key
            this._service.getModel(this.modular.url, this.key, (response: any) => {
                this.validateForm.patchValue(response)
            })
        } else {
            this.key = null;
            this.model = Object.assign({}, record.node)
            this.validateForm.patchValue(record.node)
        }
        this.visible = true
    }
    onSelect(event) {
        if (event.key) {
            if (event.group == 'In') {
                this.model.key = event.key;
                this.validateForm.patchValue({ key: event.key })
            } else {
                this.message.error(this.getTipsMsg('checkdata.check_matching'));
                this.model.key = null;
                this.validateForm.patchValue({ key: '' })
                return;
            }
        }
    }
    onSelectpair(event) {
        if (event.key) {
            if (event.group) {
                if (event.group == 'In') {
                    this.model.pair_bls_key = event.key;
                    this.model.pair_blst_key = event.blst_key;
                    this.model.pair_group = event.group;
                    this.validateForm.patchValue({ pair_bls_key: event.key, pair_blst_key: event.blst_key })
                } else {
                    this.message.error(this.getTipsMsg('checkdata.check_Rail'));
                    this.validateForm.patchValue({ pair_bls_key: '', pair_blst_key:'' })
                    return;
                }
            }
        }
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
        this.validateForm.reset()
        this.avatar = null
        this.visible = false
    }


}
